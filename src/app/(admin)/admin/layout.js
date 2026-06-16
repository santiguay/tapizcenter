'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          throw new Error('Not authenticated');
        }
        const data = await res.json();
        setUser(data.user);
        setLoading(false);
      } catch (err) {
        router.push('/login');
      }
    }
    checkAuth();

    // Determine active tab from URL path
    const path = window.location.pathname;
    if (path.includes('/admin/brands')) setActiveTab('brands');
    else if (path.includes('/admin/sublines')) setActiveTab('sublines');
    else if (path.includes('/admin/products')) setActiveTab('products');
    else if (path.includes('/admin/variants')) setActiveTab('variants');
    else if (path.includes('/admin/posts')) setActiveTab('posts');
    else setActiveTab('dashboard');
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Cargando Panel de Control...</p>
      </div>
    );
  }

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.brandTitle}>TAPIZCENTER</h2>
          <span style={styles.roleTag}>ADMIN PANEL</span>
        </div>

        <nav style={styles.nav}>
          <Link href="/admin" onClick={() => setActiveTab('dashboard')} style={activeTab === 'dashboard' ? { ...styles.navItem, ...styles.navItemActive } : styles.navItem}>
            <span style={styles.navIcon}>📊</span> Dashboard
          </Link>
          <Link href="/admin/brands" onClick={() => setActiveTab('brands')} style={activeTab === 'brands' ? { ...styles.navItem, ...styles.navItemActive } : styles.navItem}>
            <span style={styles.navIcon}>🏷️</span> Marcas
          </Link>
          <Link href="/admin/sublines" onClick={() => setActiveTab('sublines')} style={activeTab === 'sublines' ? { ...styles.navItem, ...styles.navItemActive } : styles.navItem}>
            <span style={styles.navIcon}>📈</span> Sublíneas
          </Link>
          <Link href="/admin/products" onClick={() => setActiveTab('products')} style={activeTab === 'products' ? { ...styles.navItem, ...styles.navItemActive } : styles.navItem}>
            <span style={styles.navIcon}>📦</span> Productos
          </Link>
          <Link href="/admin/variants" onClick={() => setActiveTab('variants')} style={activeTab === 'variants' ? { ...styles.navItem, ...styles.navItemActive } : styles.navItem}>
            <span style={styles.navIcon}>🎨</span> Variantes
          </Link>
          <Link href="/admin/posts" onClick={() => setActiveTab('posts')} style={activeTab === 'posts' ? { ...styles.navItem, ...styles.navItemActive } : styles.navItem}>
            <span style={styles.navIcon}>✍️</span> Blog Posts
          </Link>
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>A</div>
            <div>
              <p style={styles.userName}>{user?.name || 'Admin'}</p>
              <p style={styles.userEmail}>{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Cerrar Sesión ➔
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.pageTitle}>
            {activeTab === 'dashboard' && 'Dashboard General'}
            {activeTab === 'brands' && 'Gestión de Marcas'}
            {activeTab === 'sublines' && 'Gestión de Sublíneas'}
            {activeTab === 'products' && 'Gestión de Productos'}
            {activeTab === 'variants' && 'Gestión de Variantes'}
            {activeTab === 'posts' && 'Gestión del Blog'}
          </h1>
          <div style={styles.headerMeta}>
            <span style={styles.statusIndicator}>● Sistema Online</span>
          </div>
        </header>

        <main style={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#0D1B2A',
    color: '#ffffff',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid rgba(212, 175, 55, 0.2)',
    borderTop: '5px solid #D4AF37',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '1.5rem',
    fontSize: '1.1rem',
    color: '#778da9',
    letterSpacing: '1px',
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#0D1B2A',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid rgba(224, 225, 221, 0.1)',
  },
  sidebarHeader: {
    padding: '2rem 1.5rem',
    borderBottom: '1px solid rgba(224, 225, 221, 0.05)',
  },
  brandTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '2px',
  },
  roleTag: {
    display: 'inline-block',
    fontSize: '0.7rem',
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    color: '#D4AF37',
    padding: '0.2rem 0.6rem',
    borderRadius: '4px',
    fontWeight: '700',
    marginTop: '0.5rem',
    letterSpacing: '1px',
  },
  nav: {
    flex: 1,
    padding: '1.5rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.85rem 1rem',
    color: '#778da9',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
  },
  navItemActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    color: '#ffffff',
    borderLeft: '4px solid #D4AF37',
  },
  navIcon: {
    marginRight: '0.75rem',
    fontSize: '1.1rem',
  },
  sidebarFooter: {
    padding: '1.5rem',
    borderTop: '1px solid rgba(224, 225, 221, 0.05)',
    backgroundColor: '#0A1420',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#415A77',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '1.2rem',
  },
  userName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#ffffff',
    margin: 0,
  },
  userEmail: {
    fontSize: '0.75rem',
    color: '#778da9',
    margin: 0,
  },
  logoutButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'transparent',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#ef4444',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.85rem',
    transition: 'all 0.2s ease',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  header: {
    height: '80px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid rgba(13, 27, 42, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2.5rem',
  },
  pageTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0D1B2A',
  },
  headerMeta: {
    fontSize: '0.85rem',
    color: '#10B981',
    fontWeight: '600',
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  content: {
    padding: '2.5rem',
    flex: 1,
    maxWidth: '1600px',
    width: '100%',
    boxSizing: 'border-box',
  },
};
