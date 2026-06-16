import { prisma } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const variant = await prisma.productVariant.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!variant) return NextResponse.json({ error: 'Variante no encontrada' }, { status: 404 });
    return NextResponse.json(variant);
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;
  try {
    const { name, sku, price, image, color, size, stock, productId } = await request.json();
    const updated = await prisma.productVariant.update({
      where: { id },
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
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al actualizar variante' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.productVariant.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: 'Variante eliminada' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar variante' }, { status: 500 });
  }
}
