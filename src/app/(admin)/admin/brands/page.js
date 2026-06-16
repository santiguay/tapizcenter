'use client';

import { useEffect, useState } from 'react';

export default function BrandsManager() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBrand, setCurrentBrand] = useState({ id: '', name: '', slug: '', description: '', image: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands');
      const data = await res.json();
      setBrands(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
    // Check url params for quick action
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'new') {
      handleAddNew();
    }
  }, []);

  const handleAddNew = () => {
    setCurrentBrand({ id: '', name: '', slug: '', description: '', image: '' });
    setIsEditing(true);
  };

  const handleEdit = (brand) => {
    setCurrentBrand(brand);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar esta marca? Se eliminarán todas sus sublíneas y productos relacionados.')) return;
    try {
      const res = await fetch(`/api/brands/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess('Marca eliminada con éxito');
        fetchBrands();
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

    const url = currentBrand.id ? `/api/brands/${currentBrand.id}` : '/api/brands';
    const method = currentBrand.id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentBrand),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar');

      setSuccess('Marca guardada con éxito');
      setIsEditing(false);
      fetchBrands();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Cargando marcas...</p>;

  return (
    <div style={styles.container}>
      {success && <div style={styles.successAlert}>{success}</div>}
      {error && <div style={styles.errorAlert}>{error}</div>}

      {isEditing ? (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>{currentBrand.id ? 'Editar Marca' : 'Nueva Marca'}</h2>
          <form onSubmit={handleSave} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre de Marca *</label>
                <input
                  type="text"
                  value={currentBrand.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
                    setCurrentBrand({ ...currentBrand, name, slug });
                  }}
                  required
                  style={styles.input}
                  placeholder="Ej: Cipatex"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Slug único (URL) *</label>
                <input
                  type="text"
                  value={currentBrand.slug}
                  onChange={(e) => setCurrentBrand({ ...currentBrand, slug: e.target.value })}
                  required
                  style={styles.input}
                  placeholder="Ej: cipatex"
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Descripción</label>
              <textarea
                value={currentBrand.description || ''}
                onChange={(e) => setCurrentBrand({ ...currentBrand, description: e.target.value })}
                style={{ ...styles.input, minHeight: '100px' }}
                placeholder="Describa el origen, propósito y calidad de la marca..."
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>URL de Imagen de Portada</label>
              <input
                type="text"
                value={currentBrand.image || ''}
                onChange={(e) => setCurrentBrand({ ...currentBrand, image: e.target.value })}
                style={styles.input}
                placeholder="Ej: /images/brands/cipatex.jpg"
              />
            </div>

            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.submitBtn}>Guardar Marca</button>
              <button type="button" onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Cancelar</button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div style={styles.listHeader}>
            <h3>Listado de Marcas Registradas</h3>
            <button onClick={handleAddNew} style={styles.addBtn}>+ Nueva Marca</button>
          </div>

          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeadRow}>
                  <th style={styles.th}>Nombre</th>
                  <th style={styles.th}>Slug</th>
                  <th style={styles.th}>Descripción</th>
                  <th style={styles.th}>Sublíneas</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {brands.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={styles.emptyTd}>No hay marcas registradas.</td>
                  </tr>
                ) : (
                  brands.map((b) => (
                    <tr key={b.id} style={styles.tableRow}>
                      <td style={styles.td}><strong>{b.name}</strong></td>
                      <td style={styles.td}><code>{b.slug}</code></td>
                      <td style={styles.td}>{b.description || '-'}</td>
                      <td style={styles.td}>{b.subLines?.length || 0} sublíneas</td>
                      <td style={styles.td}>
                        <div style={styles.actionRow}>
                          <button onClick={() => handleEdit(b)} style={styles.editBtn}>Editar</button>
                          <button onClick={() => handleDelete(b.id)} style={styles.deleteBtn}>Eliminar</button>
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
    '&:hover': {
      backgroundColor: '#f8f9fa',
    },
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
