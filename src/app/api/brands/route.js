import { prisma } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      include: { subLines: true, _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener marcas' }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { name, slug, description, image } = await request.json();
    if (!name || !slug) {
      return NextResponse.json({ error: 'Nombre y slug son requeridos' }, { status: 400 });
    }

    const brand = await prisma.brand.create({
      data: { name, slug, description, image },
    });
    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al crear marca. Asegúrese de que el slug sea único.' }, { status: 500 });
  }
}
