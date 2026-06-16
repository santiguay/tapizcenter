import { prisma } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { author: { select: { name: true, email: true } } },
    });
    if (!post) return NextResponse.json({ error: 'Entrada no encontrada' }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;
  try {
    const { title, slug, summary, content, published, image } = await request.json();
    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        summary,
        content,
        published: published ?? false,
        image,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al actualizar entrada' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.blogPost.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: 'Entrada eliminada' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar entrada' }, { status: 500 });
  }
}
