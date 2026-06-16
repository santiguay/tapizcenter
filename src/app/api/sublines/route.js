import { prisma } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sublines = await prisma.subLine.findMany({
      include: { brand: true, _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(sublines);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener sublíneas' }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const { name, slug, description, image, brandId } = await request.json();
    if (!name || !slug || !brandId) {
      return NextResponse.json({ error: 'Nombre, slug y marca son requeridos' }, { status: 400 });
    }

    const subline = await prisma.subLine.create({
      data: { name, slug, description, image, brandId },
    });
    return NextResponse.json(subline, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear sublínea' }, { status: 500 });
  }
}
