'use client';

import { useEffect, useState } from 'react';

export default function PostsManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState({ id: '', title: '', slug: '', summary: '', content: '', image: '', published: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'new') {
      handleAddNew();
    }
  }, []);

  const handleAddNew = () => {
    setCurrentPost({ id: '', title: '', slug: '', summary: '', content: '', image: '', published: false });
    setIsEditing(true);
  };

  const handleEdit = (p) => {
    setCurrentPost({
      id: p.id,
      title: p.title,
      slug: p.slug,
      summary: p.summary || '',
      content: p.content,
      image: p.image || '',
      published: p.published,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar esta entrada de blog?')) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess('Entrada eliminada con éxito');
        fetchPosts();
      } else {
        const data = await res.json();
        setError(data.error || 'Error al eliminar');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const url = currentPost.id ? `/api/posts/${currentPost.id}` : '/api/posts';
    const method = currentPost.id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPost),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar');

      setSuccess('Entrada del blog guardada con éxito');
      setIsEditing(false);
      fetchPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Cargando entradas del blog...</p>;

  return (
    <div style={styles.container}>
      {success && <div style={styles.successAlert}>{success}</div>}
      {error && <div style={styles.errorAlert}>{error}</div>}

      {isEditing ? (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>{currentPost.id ? 'Editar Entrada de Blog' : 'Nueva Entrada de Blog'}</h2>
          <form onSubmit={handleSave} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Título de la Entrada *</label>
                <input
                  type="text"
                  value={currentPost.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
                    setCurrentPost({ ...currentPost, title, slug });
                  }}
                  required
                  style={styles.input}
                  placeholder="Ej: Cómo elegir la tela ideal..."
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Slug único (URL) *</label>
                <input
                  type="text"
                  value={currentPost.slug}
                  onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                  required
                  style={styles.input}
                  placeholder="Ej: como-elegir-la-tela-ideal"
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>URL de Imagen de Portada</label>
                <input
                  type="text"
                  value={currentPost.image}
                  onChange={(e) => setCurrentPost({ ...currentPost, image: e.target.value })}
                  style={styles.input}
                  placeholder="Ej: /images/blog/elegir-tela.jpg"
                />
              </div>
              <div style={{ ...styles.formGroup, justifyContent: 'center' }}>
                <label style={{ ...styles.label, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '1.5rem' }}>
                  <input
                    type="checkbox"
                    checked={currentPost.published}
                    onChange={(e) => setCurrentPost({ ...currentPost, published: e.target.checked })}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <span>Publicar entrada inmediatamente</span>
                </label>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Resumen / Copete (Se muestra en listados)</label>
              <input
                type="text"
                value={currentPost.summary}
                onChange={(e) => setCurrentPost({ ...currentPost, summary: e.target.value })}
                style={styles.input}
                placeholder="Ej: Descubrí los secretos para seleccionar el tapizado perfecto..."
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Contenido HTML completo de la entrada *</label>
              <textarea
                value={currentPost.content}
                onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                required
                style={{ ...styles.input, minHeight: '300px', fontFamily: 'monospace' }}
                placeholder="<h2>Título</h2><p>Contenido en formato HTML...</p>"
              />
            </div>

            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.submitBtn}>Guardar Entrada</button>
              <button type="button" onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Cancelar</button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div style={styles.listHeader}>
            <h3>Listado de Entradas de Blog</h3>
            <button onClick={handleAddNew} style={styles.addBtn}>+ Nueva Entrada</button>
          </div>

          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeadRow}>
                  <th style={styles.th}>Título</th>
                  <th style={styles.th}>Slug</th>
                  <th style={styles.th}>Autor</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Fecha de Creación</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={styles.emptyTd}>No hay entradas de blog registradas.</td>
                  </tr>
                ) : (
                  posts.map((p) => (
                    <tr key={p.id} style={styles.tableRow}>
                      <td style={styles.td}><strong>{p.title}</strong></td>
                      <td style={styles.td}><code>{p.slug}</code></td>
                      <td style={styles.td}>{p.author?.name || 'Admin'}</td>
                      <td style={styles.td}>
                        <span style={p.published ? styles.publishedTag : styles.draftTag}>
                          {p.published ? 'Publicado' : 'Borrador'}
                        </span>
                      </td>
                      <td style={styles.td}>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td style={styles.td}>
                        <div style={styles.actionRow}>
                          <button onClick={() => handleEdit(p)} style={styles.editBtn}>Editar</button>
                          <button onClick={() => handleDelete(p.id)} style={styles.deleteBtn}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid rgba(13, 27, 42, 0.08)',
    padding: '2rem',
  },
  listHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  addBtn: {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#0D1B2A',
    color: '#ffffff',
    borderRadius: '6px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  tableHeadRow: {
    backgroundColor: '#F8F9FA',
    borderBottom: '2px solid #E0E1DD',
  },
  th: {
    padding: '1rem',
    fontWeight: '700',
    color: '#1B263B',
    fontSize: '0.9rem',
  },
  tableRow: {
    borderBottom: '1px solid #E0E1DD',
    transition: 'background-color 0.2s',
  },
  td: {
    padding: '1rem',
    fontSize: '0.95rem',
    color: '#1B263B',
  },
  emptyTd: {
    padding: '2rem',
    textAlign: 'center',
    color: '#778DA9',
  },
  publishedTag: {
    backgroundColor: '#DEF7EC',
    color: '#03543F',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  draftTag: {
    backgroundColor: '#F3F4F6',
    color: '#374151',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  actionRow: {
    display: 'flex',
    gap: '0.5rem',
  },
  editBtn: {
    padding: '0.4rem 0.8rem',
    backgroundColor: '#E0E1DD',
    color: '#1B263B',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  deleteBtn: {
    padding: '0.4rem 0.8rem',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  card: {
    padding: '1rem 0',
  },
  cardTitle: {
    marginBottom: '1.5rem',
    color: '#0D1B2A',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.25rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#415A77',
  },
  input: {
    padding: '0.75rem 1rem',
    border: '1px solid #C0C0C0',
    borderRadius: '6px',
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  submitBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#D4AF37',
    color: '#0D1B2A',
    fontWeight: '700',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#E0E1DD',
    color: '#1B263B',
    fontWeight: '600',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  successAlert: {
    padding: '0.75rem 1rem',
    backgroundColor: '#DEF7EC',
    color: '#03543F',
    borderRadius: '6px',
    marginBottom: '1rem',
  },
  errorAlert: {
    padding: '0.75rem 1rem',
    backgroundColor: '#FDE8E8',
    color: '#9B1C1C',
    borderRadius: '6px',
    marginBottom: '1rem',
  },
};
