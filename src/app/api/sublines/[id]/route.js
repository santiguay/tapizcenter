import { prisma } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const subline = await prisma.subLine.findUnique({
      where: { id },
      include: { brand: true },
    });
    if (!subline) return NextResponse.json({ error: 'Sublínea no encontrada' }, { status: 404 });
    return NextResponse.json(subline);
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;
  try {
    const { name, slug, description, image, brandId } = await request.json();
    const updated = await prisma.subLine.update({
      where: { id },
      data: { name, slug, description, image, brandId },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar sublínea' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.subLine.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: 'Sublínea eliminada' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar sublínea' }, { status: 500 });
  }
}
