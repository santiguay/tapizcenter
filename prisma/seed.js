const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding started...');

  // 1. Clean existing database
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subLine.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@tapizcenter.com',
      password: passwordHash,
      name: 'Administrador TapizCenter',
      role: 'admin',
    },
  });
  console.log('Admin user created:', admin.email);

  // 3. Create Brands
  const brandCipatex = await prisma.brand.create({
    data: {
      name: 'Cipatex',
      slug: 'cipatex',
      description: 'Líder en revestimientos sintéticos de alta tecnología y performance para tapicería corporativa, náutica y residencial.',
      image: '/images/brands/cipatex.jpg',
    },
  });

  const brandTapiz = await prisma.brand.create({
    data: {
      name: 'TapizCenter Selection',
      slug: 'tapizcenter-selection',
      description: 'Nuestra exclusiva selección de panas, linos y tejidos importados de calidad premium para el hogar exigente.',
      image: '/images/brands/selection.jpg',
    },
  });

  console.log('Brands created.');

  // 4. Create SubLines
  const subFacto = await prisma.subLine.create({
    data: {
      name: 'Línea Facto',
      slug: 'linea-facto',
      description: 'Sintéticos de alta gama con soporte de punto de poliéster/algodón. Ideal para alto tránsito y náutica.',
      brandId: brandCipatex.id,
      image: '/images/sublines/facto.jpg',
    },
  });

  const subCorano = await prisma.subLine.create({
    data: {
      name: 'Línea Corano',
      slug: 'linea-corano',
      description: 'Sintéticos premium para tapicería residencial y oficinas. Estilo, confort y fácil limpieza.',
      brandId: brandCipatex.id,
      image: '/images/sublines/corano.jpg',
    },
  });

  const subTerciopelo = await prisma.subLine.create({
    data: {
      name: 'Terciopelos & Panas',
      slug: 'terciopelos-y-panas',
      description: 'Telas ultra suaves al tacto con tecnología antimanchas y una paleta de colores deslumbrante.',
      brandId: brandTapiz.id,
      image: '/images/sublines/terciopelo.jpg',
    },
  });

  const subLino = await prisma.subLine.create({
    data: {
      name: 'Linos Premium',
      slug: 'linos-premium',
      description: 'Tejidos de lino y algodón con textura rústica elegante y gran durabilidad para livings.',
      brandId: brandTapiz.id,
      image: '/images/sublines/lino.jpg',
    },
  });

  console.log('Sublines created.');

  // 5. Create Products & Variants
  // Product 1: Facto Náutico
  const prodFactoNautico = await prisma.product.create({
    data: {
      name: 'Facto Náutico',
      slug: 'facto-nautico',
      description: 'El revestimiento sintético por excelencia para yates y lanchas. Resistente a rayos UV, salinidad y hongos.',
      brandId: brandCipatex.id,
      subLineId: subFacto.id,
      image: '/images/products/facto-nautico.jpg',
    },
  });

  await prisma.productVariant.createMany({
    data: [
      {
        name: 'Facto Náutico Royal Blue',
        sku: 'FACTO-NAU-01',
        price: 45.0,
        color: 'Azul Real',
        size: '1.40m ancho',
        stock: 150,
        productId: prodFactoNautico.id,
        image: '/images/variants/facto-nautico-blue.jpg',
      },
      {
        name: 'Facto Náutico Blanco Polar',
        sku: 'FACTO-NAU-02',
        price: 45.0,
        color: 'Blanco Polar',
        size: '1.40m ancho',
        stock: 200,
        productId: prodFactoNautico.id,
        image: '/images/variants/facto-nautico-white.jpg',
      },
    ],
  });

  // Product 2: Corano EasyClean
  const prodCoranoEasy = await prisma.product.create({
    data: {
      name: 'Corano EasyClean',
      slug: 'corano-easyclean',
      description: 'Sintético residencial con acabado exclusivo de protección que evita la penetración de suciedad.',
      brandId: brandCipatex.id,
      subLineId: subCorano.id,
      image: '/images/products/corano-easy.jpg',
    },
  });

  await prisma.productVariant.createMany({
    data: [
      {
        name: 'Corano EasyClean Beige',
        sku: 'CORANO-EAS-01',
        price: 28.5,
        color: 'Beige',
        size: '1.40m ancho',
        stock: 300,
        productId: prodCoranoEasy.id,
        image: '/images/variants/corano-beige.jpg',
      },
      {
        name: 'Corano EasyClean Gris Grafito',
        sku: 'CORANO-EAS-02',
        price: 28.5,
        color: 'Gris Grafito',
        size: '1.40m ancho',
        stock: 120,
        productId: prodCoranoEasy.id,
        image: '/images/variants/corano-grey.jpg',
      },
    ],
  });

  // Product 3: Pana París (Selection)
  const prodPanaParis = await prisma.product.create({
    data: {
      name: 'Pana París',
      slug: 'pana-paris',
      description: 'Pana importada de altísima calidad con tratamiento repelente a líquidos y tacto soft aterciopelado.',
      brandId: brandTapiz.id,
      subLineId: subTerciopelo.id,
      image: '/images/products/pana-paris.jpg',
    },
  });

  await prisma.productVariant.createMany({
    data: [
      {
        name: 'Pana París Blue Indigo',
        sku: 'PANA-PAR-01',
        price: 35.0,
        color: 'Azul Índigo',
        size: '1.45m ancho',
        stock: 80,
        productId: prodPanaParis.id,
        image: '/images/variants/pana-indigo.jpg',
      },
      {
        name: 'Pana París Esmeralda',
        sku: 'PANA-PAR-02',
        price: 35.0,
        color: 'Verde Esmeralda',
        size: '1.45m ancho',
        stock: 45,
        productId: prodPanaParis.id,
        image: '/images/variants/pana-emerald.jpg',
      },
    ],
  });

  // Product 4: Lino Torino (Selection)
  const prodLinoTorino = await prisma.product.create({
    data: {
      name: 'Lino Torino',
      slug: 'lino-torino',
      description: 'Lino rústico premium reforzado con base de jersey para garantizar durabilidad y estructura impecable.',
      brandId: brandTapiz.id,
      subLineId: subLino.id,
      image: '/images/products/lino-torino.jpg',
    },
  });

  await prisma.productVariant.createMany({
    data: [
      {
        name: 'Lino Torino Natural',
        sku: 'LINO-TOR-01',
        price: 32.0,
        color: 'Lino Natural',
        size: '1.45m ancho',
        stock: 110,
        productId: prodLinoTorino.id,
        image: '/images/variants/lino-natural.jpg',
      },
      {
        name: 'Lino Torino Denim',
        sku: 'LINO-TOR-02',
        price: 32.0,
        color: 'Azul Denim',
        size: '1.45m ancho',
        stock: 65,
        productId: prodLinoTorino.id,
        image: '/images/variants/lino-denim.jpg',
      },
    ],
  });

  console.log('Products and variants created.');

  // 6. Create Blog Posts
  await prisma.blogPost.create({
    data: {
      title: 'Cómo Elegir la Tela Ideal para tu Sillón: Guía Definitiva',
      slug: 'como-elegir-la-tela-ideal-para-tu-sillon',
      summary: 'Descubrí los secretos para seleccionar el tapizado perfecto según el uso, estilo de vida y mascotas.',
      content: `<h2>La elección del tapizado: Todo lo que tenés que saber</h2>
<p>Elegir la tela para tu sillón no es solo cuestión de color. Debemos considerar la durabilidad, el tránsito en el hogar, la facilidad de limpieza y el confort. En este post te explicamos las diferencias clave entre sintéticos de alta gama, panas con proceso antimanchas y linos rústicos.</p>
<h3>1. Alto tránsito y mascotas: El poder del sintético</h3>
<p>Si tenés chicos o mascotas, líneas como <strong>Corano EasyClean</strong> de Cipatex son un gol de media cancha: no absorben líquidos y se limpian simplemente con un trapo húmedo y jabón neutro.</p>
<h3>2. La elegancia de las Panas</h3>
<p>Nuestra <strong>Pana París</strong> aporta una textura única y calidez. Gracias a los tratamientos de repelencia al agua modernos, ya no tenés que temerle a las manchas cotidianas.</p>
<p>¡Vení a nuestro showroom a tocar y sentir la calidad de nuestros géneros!</p>`,
      published: true,
      authorId: admin.id,
      image: '/images/blog/elegir-tela.jpg',
    },
  });

  await prisma.blogPost.create({
    data: {
      title: 'El Auge de la Náutica y las Telas Técnicas de Cipatex',
      slug: 'el-auge-de-la-nautica-y-las-telas-tecnicas-de-cipatex',
      summary: 'La línea Facto Náutico redefine los estándares de resistencia y estilo en embarcaciones de lujo.',
      content: `<h2>Resistencia extrema al sol y la sal</h2>
<p>Las embarcaciones están expuestas a las condiciones climáticas más adversas: sol abrasador, humedad constante y salitre. Las telas convencionales se decoloran y pudren en pocos meses.</p>
<h3>La solución: Facto Náutico</h3>
<p>Desarrollado especialmente por Cipatex, este revestimiento cuenta con protección contra rayos UV, antihongos y es completamente impermeable. Es la elección preferida de los astilleros más importantes de la región.</p>`,
      published: true,
      authorId: admin.id,
      image: '/images/blog/nautica-cipatex.jpg',
    },
  });

  console.log('Blog posts created.');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
