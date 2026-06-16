import { prisma } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyPublished = searchParams.get('published') === 'true';

    const posts = await prisma.blogPost.findMany({
      where: onlyPublished ? { published: true } : {},
      include: { author: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener entradas del blog' }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const { title, slug, summary, content, published, image } = await request.json();
    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Título, slug y contenido son requeridos' }, { status: 400 });
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        summary,
        content,
        published: published ?? false,
        image,
        authorId: admin.userId,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al crear entrada del blog' }, { status: 500 });
  }
}
