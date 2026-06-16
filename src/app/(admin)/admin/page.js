'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    brands: 0,
    sublines: 0,
    products: 0,
    variants: 0,
    posts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [resBrands, resSublines, resProducts, resVariants, resPosts] = await Promise.all([
          fetch('/api/brands'),
          fetch('/api/sublines'),
          fetch('/api/products'),
          fetch('/api/variants'),
          fetch('/api/posts'),
        ]);

        const brands = await resBrands.json();
        const sublines = await resSublines.json();
        const products = await resProducts.json();
        const variants = await resVariants.json();
        const posts = await resPosts.json();

        setStats({
          brands: brands.length || 0,
          sublines: sublines.length || 0,
          products: products.length || 0,
          variants: variants.length || 0,
          posts: posts.length || 0,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <p>Cargando estadísticas...</p>;
  }

  const statCards = [
    { title: 'Marcas', count: stats.brands, icon: '🏷️', color: '#1B263B', link: '/admin/brands' },
    { title: 'Sublíneas', count: stats.sublines, icon: '📈', color: '#415A77', link: '/admin/sublines' },
    { title: 'Productos', count: stats.products, icon: '📦', color: '#003049', link: '/admin/products' },
    { title: 'Variantes', count: stats.variants, icon: '🎨', color: '#D4AF37', link: '/admin/variants', darkText: true },
    { title: 'Blog Posts', count: stats.posts, icon: '✍️', color: '#669BBC', link: '/admin/posts' },
  ];

  return (
    <div>
      <div style={styles.grid}>
        {statCards.map((card, idx) => (
          <Link href={card.link} key={idx} style={{ ...styles.card, backgroundColor: card.color }}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>{card.icon}</span>
              <span style={{ ...styles.cardTitle, color: card.darkText ? '#0D1B2A' : '#ffffff' }}>{card.title}</span>
            </div>
            <div style={{ ...styles.cardCount, color: card.darkText ? '#0D1B2A' : '#ffffff' }}>{card.count}</div>
            <div style={{ ...styles.cardFooter, color: card.darkText ? '#0D1B2A' : '#e0e1dd' }}>
              Ver detalles y gestionar ➔
            </div>
          </Link>
        ))}
      </div>

      <div style={styles.quickStartSection}>
        <h3 style={styles.sectionTitle}>Accesos Rápidos de Creación</h3>
        <div style={styles.buttonGrid}>
          <Link href="/admin/brands?action=new" style={styles.quickButton}>+ Nueva Marca</Link>
          <Link href="/admin/sublines?action=new" style={styles.quickButton}>+ Nueva Sublínea</Link>
          <Link href="/admin/products?action=new" style={styles.quickButton}>+ Nuevo Producto</Link>
          <Link href="/admin/variants?action=new" style={styles.quickButton}>+ Nueva Variante</Link>
          <Link href="/admin/posts?action=new" style={styles.quickButton}>+ Nuevo Post</Link>
        </div>
      </div>

      <div style={styles.infoBox}>
        <h4>💡 Consejo de Arquitectura</h4>
        <p>
          Este panel de control se comunica directamente con la base de datos local SQLite a través del ORM Prisma. 
          Cualquier cambio realizado en los formularios se reflejará inmediatamente en el catálogo público y en el blog.
        </p>
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  card: {
    padding: '2rem 1.5rem',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '160px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  cardIcon: {
    fontSize: '1.5rem',
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: '1.1rem',
    letterSpacing: '0.5px',
  },
  cardCount: {
    fontSize: '3rem',
    fontWeight: '800',
    margin: '1rem 0',
  },
  cardFooter: {
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  quickStartSection: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '2rem',
    border: '1px solid rgba(13, 27, 42, 0.08)',
    marginBottom: '2rem',
  },
  sectionTitle: {
    marginBottom: '1.5rem',
    fontSize: '1.25rem',
    color: '#0D1B2A',
  },
  buttonGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  quickButton: {
    padding: '0.75rem 1.25rem',
    backgroundColor: '#0D1B2A',
    color: '#ffffff',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.9rem',
    border: 'none',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px rgba(13, 27, 42, 0.15)',
  },
  infoBox: {
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderLeft: '4px solid #D4AF37',
    padding: '1.5rem',
    borderRadius: '0 8px 8px 0',
    color: '#1B263B',
  },
};
