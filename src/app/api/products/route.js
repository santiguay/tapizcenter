import { prisma } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        brand: true,
        subLine: true,
        variants: true,
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const { name, slug, description, image, brandId, subLineId } = await request.json();
    if (!name || !slug || !brandId) {
      return NextResponse.json({ error: 'Nombre, slug y marca son requeridos' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        image,
        brandId,
        subLineId: subLineId || null,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  }
}
