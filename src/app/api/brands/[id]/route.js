import { prisma } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: { subLines: true },
    });
    if (!brand) return NextResponse.json({ error: 'Marca no encontrada' }, { status: 404 });
    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;
  try {
    const { name, slug, description, image } = await request.json();
    const updated = await prisma.brand.update({
      where: { id },
      data: { name, slug, description, image },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar marca' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.brand.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: 'Marca eliminada' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar marca' }, { status: 500 });
  }
}
