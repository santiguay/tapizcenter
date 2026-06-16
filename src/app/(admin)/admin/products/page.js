'use client';

import { useEffect, useState } from 'react';

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sublines, setSublines] = useState([]);
  const [filteredSublines, setFilteredSublines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ id: '', name: '', slug: '', description: '', image: '', brandId: '', subLineId: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      const [resProd, resBrand, resSub] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/brands'),
        fetch('/api/sublines'),
      ]);
      const dataProd = await resProd.json();
      const dataBrand = await resBrand.json();
      const dataSub = await resSub.json();
      setProducts(dataProd);
      setBrands(dataBrand);
      setSublines(dataSub);
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

  // Filter sublines when brand changes
  useEffect(() => {
    if (currentProduct.brandId) {
      const filtered = sublines.filter(s => s.brandId === currentProduct.brandId);
      setFilteredSublines(filtered);
      // Reset subLineId if the current selected subline doesn't belong to the selected brand
      if (currentProduct.subLineId && !filtered.some(s => s.id === currentProduct.subLineId)) {
        setCurrentProduct(prev => ({ ...prev, subLineId: '' }));
      }
    } else {
      setFilteredSublines([]);
    }
  }, [currentProduct.brandId, sublines]);

  const handleAddNew = () => {
    setCurrentProduct({ id: '', name: '', slug: '', description: '', image: '', brandId: brands[0]?.id || '', subLineId: '' });
    setIsEditing(true);
  };

  const handleEdit = (product) => {
    setCurrentProduct({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      image: product.image || '',
      brandId: product.brandId,
      subLineId: product.subLineId || '',
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar este producto? Se eliminarán todas sus variantes.')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess('Producto eliminado con éxito');
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

    const url = currentProduct.id ? `/api/products/${currentProduct.id}` : '/api/products';
    const method = currentProduct.id ? 'PUT' : 'POST';

    // Handle empty subline
    const payload = {
      ...currentProduct,
      subLineId: currentProduct.subLineId || null,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar');

      setSuccess('Producto guardado con éxito');
      setIsEditing(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div style={styles.container}>
      {success && <div style={styles.successAlert}>{success}</div>}
      {error && <div style={styles.errorAlert}>{error}</div>}

      {isEditing ? (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>{currentProduct.id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <form onSubmit={handleSave} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre de Producto *</label>
                <input
                  type="text"
                  value={currentProduct.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
                    setCurrentProduct({ ...currentProduct, name, slug });
                  }}
                  required
                  style={styles.input}
                  placeholder="Ej: Facto Náutico"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Slug único (URL) *</label>
                <input
                  type="text"
                  value={currentProduct.slug}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, slug: e.target.value })}
                  required
                  style={styles.input}
                  placeholder="Ej: facto-nautico"
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Marca *</label>
                <select
                  value={currentProduct.brandId}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, brandId: e.target.value })}
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
                <label style={styles.label}>Sublínea (Opcional)</label>
                <select
                  value={currentProduct.subLineId}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, subLineId: e.target.value })}
                  style={styles.input}
                >
                  <option value="">Ninguna - Sin Sublínea</option>
                  {filteredSublines.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>URL de Imagen de Portada</label>
              <input
                type="text"
                value={currentProduct.image || ''}
                onChange={(e) => setCurrentProduct({ ...currentProduct, image: e.target.value })}
                style={styles.input}
                placeholder="Ej: /images/products/facto-nautico.jpg"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Descripción del Producto</label>
              <textarea
                value={currentProduct.description || ''}
                onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                style={{ ...styles.input, minHeight: '100px' }}
                placeholder="Describa los atributos del producto, usos, resistencia..."
              />
            </div>

            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.submitBtn}>Guardar Producto</button>
              <button type="button" onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Cancelar</button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div style={styles.listHeader}>
            <h3>Listado de Productos</h3>
            <button onClick={handleAddNew} style={styles.addBtn} disabled={brands.length === 0}>
              + Nuevo Producto
            </button>
          </div>

          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeadRow}>
                  <th style={styles.th}>Nombre</th>
                  <th style={styles.th}>Marca</th>
                  <th style={styles.th}>Sublínea</th>
                  <th style={styles.th}>Variantes</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={styles.emptyTd}>No hay productos registrados.</td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} style={styles.tableRow}>
                      <td style={styles.td}><strong>{p.name}</strong></td>
                      <td style={styles.td}>{p.brand?.name}</td>
                      <td style={styles.td}>{p.subLine?.name || '-'}</td>
                      <td style={styles.td}>{p.variants?.length || 0} variantes</td>
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
