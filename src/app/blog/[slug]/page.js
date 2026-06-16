import { prisma } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
  });

  if (!post) {
    return {
      title: 'Artículo No Encontrado | TapizCenter',
    };
  }

  return {
    title: `${post.title} | Blog TapizCenter`,
    description: post.summary || 'Blog de tendencias y telas de TapizCenter',
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
    include: { author: { select: { name: true } } },
  });

  if (!post) {
    notFound();
  }

  return (
    <div style={styles.section}>
      <div className="container" style={styles.contentContainer}>
        
        {/* Back Link */}
        <Link href="/blog" style={styles.backLink}>
          ➔ Volver al Blog
        </Link>

        {/* Post Image */}
        {post.image && (
          <div style={{ ...styles.imageBanner, backgroundImage: `url(${post.image})` }} />
        )}

        {/* Post Info Header */}
        <header style={styles.header}>
          <span style={styles.date}>
            {new Date(post.createdAt).toLocaleDateString('es-AR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <h1 style={styles.title}>{post.title}</h1>
          <p style={styles.author}>Por <strong>{post.author?.name || 'Administrador'}</strong></p>
        </header>

        {/* HTML Content */}
        <div 
          style={styles.content} 
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
        
      </div>
    </div>
  );
}

const styles = {
  section: {
    padding: '4rem 0',
    backgroundColor: '#ffffff',
    minHeight: '85vh',
  },
  contentContainer: {
    maxWidth: '800px',
  },
  backLink: {
    display: 'inline-block',
    transform: 'scaleX(-1)', // flips the arrow
    color: '#D4AF37',
    fontWeight: '700',
    fontSize: '0.95rem',
    marginBottom: '2rem',
    cursor: 'pointer',
  },
  imageBanner: {
    width: '100%',
    height: '400px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(13, 27, 42, 0.1)',
    marginBottom: '2.5rem',
    backgroundColor: '#0D1B2A',
  },
  header: {
    marginBottom: '2.5rem',
    borderBottom: '1px solid rgba(13, 27, 42, 0.08)',
    paddingBottom: '2.5rem',
  },
  date: {
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    color: '#778DA9',
    fontWeight: '700',
    letterSpacing: '1px',
    display: 'block',
    marginBottom: '0.75rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#0D1B2A',
    lineHeight: '1.25',
    marginBottom: '1rem',
  },
  author: {
    color: '#415A77',
    fontSize: '0.95rem',
  },
  content: {
    color: '#1B263B',
    fontSize: '1.15rem',
    lineHeight: '1.8',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
};
