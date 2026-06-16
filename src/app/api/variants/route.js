import { prisma } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const variants = await prisma.productVariant.findMany({
      include: { product: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(variants);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener variantes' }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const { name, sku, price, image, color, size, stock, productId } = await request.json();
    if (!name || !productId) {
      return NextResponse.json({ error: 'Nombre y producto son requeridos' }, { status: 400 });
    }

    const variant = await prisma.productVariant.create({
      data: {
        name,
        sku: sku || null,
        price: price ? parseFloat(price) : null,
        image,
        color,
        size,
        stock: stock ? parseInt(stock) : 0,
        productId,
      },
    });
    return NextResponse.json(variant, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al crear variante' }, { status: 500 });
  }
}
