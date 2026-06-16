'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch('/api/posts?published=true');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error('Error loading posts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Cargando blog...</p>
      </div>
    );
  }

  return (
    <div style={styles.section}>
      <div className="container">
        
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Blog & Tendencias</h1>
          <p style={styles.subtitle}>
            Inspiración, guías de cuidado y las últimas novedades de TapizCenter y Cipatex.
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div style={styles.emptyState}>
            <p>Próximamente compartiremos artículos de interés. ¡Mantente al tanto!</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {posts.map((post) => (
              <article key={post.id} style={styles.card}>
                {post.image && (
                  <div style={{ ...styles.imageContainer, backgroundImage: `url(${post.image})` }} />
                )}
                <div style={styles.cardBody}>
                  <span style={styles.date}>
                    {new Date(post.createdAt).toLocaleDateString('es-AR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <h2 style={styles.postTitle}>
                    <Link href={`/blog/${post.slug}`} style={styles.postLink}>
                      {post.title}
                    </Link>
                  </h2>
                  <p style={styles.summary}>{post.summary}</p>
                  <Link href={`/blog/${post.slug}`} style={styles.readMore}>
                    Leer Artículo Completo ➔
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  section: {
    padding: '4rem 0',
    backgroundColor: '#F8F9FA',
    minHeight: '85vh',
  },
  header: {
    marginBottom: '3.5rem',
    borderLeft: '4px solid var(--color-gold)',
    paddingLeft: '1.5rem',
  },
  pageTitle: {
    fontSize: '2.5rem',
    fontWeight: 900,
    color: '#0D1B2A',
  },
  subtitle: {
    color: '#415A77',
    fontSize: '1.1rem',
    marginTop: '0.5rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid rgba(13, 27, 42, 0.08)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2.5rem',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(13, 27, 42, 0.05)',
    overflow: 'hidden',
    border: '1px solid rgba(13, 27, 42, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.25s ease',
  },
  imageContainer: {
    height: '220px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#0D1B2A',
  },
  cardBody: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  date: {
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    color: '#778DA9',
    fontWeight: '700',
    letterSpacing: '0.5px',
    marginBottom: '0.75rem',
  },
  postTitle: {
    fontSize: '1.35rem',
    fontWeight: '700',
    lineHeight: '1.3',
    marginBottom: '1rem',
  },
  postLink: {
    color: '#0D1B2A',
    textDecoration: 'none',
  },
  summary: {
    color: '#415A77',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
    flex: 1,
  },
  readMore: {
    color: '#D4AF37',
    fontWeight: '700',
    fontSize: '0.9rem',
    textDecoration: 'none',
  },
};
