'use client';

import { useEffect, useState } from 'react';

export default function SublinesManager() {
  const [sublines, setSublines] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubline, setCurrentSubline] = useState({ id: '', name: '', slug: '', description: '', image: '', brandId: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      const [resSub, resBrand] = await Promise.all([
        fetch('/api/sublines'),
        fetch('/api/brands'),
      ]);
      const dataSub = await resSub.json();
      const dataBrand = await resBrand.json();
      setSublines(dataSub);
      setBrands(dataBrand);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'new') {
      handleAddNew();
    }
  }, []);

  const handleAddNew = () => {
    setCurrentSubline({ id: '', name: '', slug: '', description: '', image: '', brandId: brands[0]?.id || '' });
    setIsEditing(true);
  };

  const handleEdit = (subline) => {
    setCurrentSubline(subline);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar esta sublínea?')) return;
    try {
      const res = await fetch(`/api/sublines/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess('Sublínea eliminada con éxito');
        fetchData();
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

    const url = currentSubline.id ? `/api/sublines/${currentSubline.id}` : '/api/sublines';
    const method = currentSubline.id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentSubline),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar');

      setSuccess('Sublínea guardada con éxito');
      setIsEditing(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Cargando sublíneas...</p>;

  return (
    <div style={styles.container}>
      {success && <div style={styles.successAlert}>{success}</div>}
      {error && <div style={styles.errorAlert}>{error}</div>}

      {isEditing ? (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>{currentSubline.id ? 'Editar Sublínea' : 'Nueva Sublínea'}</h2>
          <form onSubmit={handleSave} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre de Sublínea *</label>
                <input
                  type="text"
                  value={currentSubline.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
                    setCurrentSubline({ ...currentSubline, name, slug });
                  }}
                  required
                  style={styles.input}
                  placeholder="Ej: Línea Facto"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Slug único (URL) *</label>
                <input
                  type="text"
                  value={currentSubline.slug}
                  onChange={(e) => setCurrentSubline({ ...currentSubline, slug: e.target.value })}
                  required
                  style={styles.input}
                  placeholder="Ej: linea-facto"
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Marca de Pertenencia *</label>
                <select
                  value={currentSubline.brandId}
                  onChange={(e) => setCurrentSubline({ ...currentSubline, brandId: e.target.value })}
                  required
                  style={styles.input}
                >
                  <option value="" disabled>Seleccione una marca</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>URL de Imagen de Portada</label>
                <input
                  type="text"
                  value={currentSubline.image || ''}
                  onChange={(e) => setCurrentSubline({ ...currentSubline, image: e.target.value })}
                  style={styles.input}
                  placeholder="Ej: /images/sublines/facto.jpg"
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Descripción</label>
              <textarea
                value={currentSubline.description || ''}
                onChange={(e) => setCurrentSubline({ ...currentSubline, description: e.target.value })}
                style={{ ...styles.input, minHeight: '100px' }}
                placeholder="Detalles específicos sobre esta línea de productos..."
              />
            </div>

            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.submitBtn}>Guardar Sublínea</button>
              <button type="button" onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Cancelar</button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div style={styles.listHeader}>
            <h3>Listado de Sublíneas</h3>
            <button onClick={handleAddNew} style={styles.addBtn} disabled={brands.length === 0}>
              + Nueva Sublínea
            </button>
          </div>

          {brands.length === 0 && (
            <div style={styles.warningBox}>
              ⚠️ Debe registrar al menos una marca antes de poder añadir sublíneas.
            </div>
          )}

          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeadRow}>
                  <th style={styles.th}>Nombre</th>
                  <th style={styles.th}>Slug</th>
                  <th style={styles.th}>Marca</th>
                  <th style={styles.th}>Productos</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sublines.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={styles.emptyTd}>No hay sublíneas registradas.</td>
                  </tr>
                ) : (
                  sublines.map((s) => (
                    <tr key={s.id} style={styles.tableRow}>
                      <td style={styles.td}><strong>{s.name}</strong></td>
                      <td style={styles.td}><code>{s.slug}</code></td>
                      <td style={styles.td}>{s.brand?.name}</td>
                      <td style={styles.td}>{s._count?.products || 0} productos</td>
                      <td style={styles.td}>
                        <div style={styles.actionRow}>
                          <button onClick={() => handleEdit(s)} style={styles.editBtn}>Editar</button>
                          <button onClick={() => handleDelete(s.id)} style={styles.deleteBtn}>Eliminar</button>
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
  warningBox: {
    padding: '1rem',
    backgroundColor: '#FFFBEB',
    color: '#B45309',
    border: '1px solid #FCD34D',
    borderRadius: '8px',
    marginBottom: '1.5rem',
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
