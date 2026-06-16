'use client';

import { useEffect, useState } from 'react';

export default function VariantsManager() {
  const [variants, setVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVariant, setCurrentVariant] = useState({ id: '', name: '', sku: '', price: '', image: '', color: '', size: '', stock: '0', productId: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      const [resVar, resProd] = await Promise.all([
        fetch('/api/variants'),
        fetch('/api/products'),
      ]);
      const dataVar = await resVar.json();
      const dataProd = await resProd.json();
      setVariants(dataVar);
      setProducts(dataProd);
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
    setCurrentVariant({ id: '', name: '', sku: '', price: '', image: '', color: '', size: '', stock: '0', productId: products[0]?.id || '' });
    setIsEditing(true);
  };

  const handleEdit = (v) => {
    setCurrentVariant({
      id: v.id,
      name: v.name,
      sku: v.sku || '',
      price: v.price ? v.price.toString() : '',
      image: v.image || '',
      color: v.color || '',
      size: v.size || '',
      stock: v.stock.toString(),
      productId: v.productId,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar esta variante?')) return;
    try {
      const res = await fetch(`/api/variants/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess('Variante eliminada con éxito');
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

    const url = currentVariant.id ? `/api/variants/${currentVariant.id}` : '/api/variants';
    const method = currentVariant.id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentVariant),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar');

      setSuccess('Variante guardada con éxito');
      setIsEditing(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Cargando variantes...</p>;

  return (
    <div style={styles.container}>
      {success && <div style={styles.successAlert}>{success}</div>}
      {error && <div style={styles.errorAlert}>{error}</div>}

      {isEditing ? (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>{currentVariant.id ? 'Editar Variante' : 'Nueva Variante'}</h2>
          <form onSubmit={handleSave} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre de la Variante (Color/Estilo) *</label>
                <input
                  type="text"
                  value={currentVariant.name}
                  onChange={(e) => setCurrentVariant({ ...currentVariant, name: e.target.value })}
                  required
                  style={styles.input}
                  placeholder="Ej: Facto Náutico Royal Blue"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Producto Perteneciente *</label>
                <select
                  value={currentVariant.productId}
                  onChange={(e) => setCurrentVariant({ ...currentVariant, productId: e.target.value })}
                  required
                  style={styles.input}
                >
                  <option value="" disabled>Seleccione un producto</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.brand?.name})</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>SKU único (Código de barra/artículo)</label>
                <input
                  type="text"
                  value={currentVariant.sku}
                  onChange={(e) => setCurrentVariant({ ...currentVariant, sku: e.target.value })}
                  style={styles.input}
                  placeholder="Ej: FACTO-NAU-01"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Precio (USD) (Opcional)</label>
                <input
                  type="number"
                  step="0.01"
                  value={currentVariant.price}
                  onChange={(e) => setCurrentVariant({ ...currentVariant, price: e.target.value })}
                  style={styles.input}
                  placeholder="Ej: 45.00"
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Color específico (Ej: Azul Real)</label>
                <input
                  type="text"
                  value={currentVariant.color}
                  onChange={(e) => setCurrentVariant({ ...currentVariant, color: e.target.value })}
                  style={styles.input}
                  placeholder="Ej: Azul Real"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tamaño / Ancho (Ej: 1.40m ancho)</label>
                <input
                  type="text"
                  value={currentVariant.size}
                  onChange={(e) => setCurrentVariant({ ...currentVariant, size: e.target.value })}
                  style={styles.input}
                  placeholder="Ej: 1.40m ancho"
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Stock Inicial *</label>
                <input
                  type="number"
                  value={currentVariant.stock}
                  onChange={(e) => setCurrentVariant({ ...currentVariant, stock: e.target.value })}
                  required
                  style={styles.input}
                  placeholder="Ej: 150"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>URL de Imagen de Variante</label>
                <input
                  type="text"
                  value={currentVariant.image}
                  onChange={(e) => setCurrentVariant({ ...currentVariant, image: e.target.value })}
                  style={styles.input}
                  placeholder="Ej: /images/variants/facto-nautico-blue.jpg"
                />
              </div>
            </div>

            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.submitBtn}>Guardar Variante</button>
              <button type="button" onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Cancelar</button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div style={styles.listHeader}>
            <h3>Listado de Variantes</h3>
            <button onClick={handleAddNew} style={styles.addBtn} disabled={products.length === 0}>
              + Nueva Variante
            </button>
          </div>

          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeadRow}>
                  <th style={styles.th}>Nombre</th>
                  <th style={styles.th}>Producto</th>
                  <th style={styles.th}>SKU</th>
                  <th style={styles.th}>Color</th>
                  <th style={styles.th}>Precio</th>
                  <th style={styles.th}>Stock</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {variants.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={styles.emptyTd}>No hay variantes registradas.</td>
                  </tr>
                ) : (
                  variants.map((v) => (
                    <tr key={v.id} style={styles.tableRow}>
                      <td style={styles.td}><strong>{v.name}</strong></td>
                      <td style={styles.td}>{v.product?.name}</td>
                      <td style={styles.td}><code>{v.sku || '-'}</code></td>
                      <td style={styles.td}>{v.color || '-'}</td>
                      <td style={styles.td}>{v.price ? `USD ${v.price.toFixed(2)}` : '-'}</td>
                      <td style={styles.td}>{v.stock} uds</td>
                      <td style={styles.td}>
                        <div style={styles.actionRow}>
                          <button onClick={() => handleEdit(v)} style={styles.editBtn}>Editar</button>
                          <button onClick={() => handleDelete(v.id)} style={styles.deleteBtn}>Eliminar</button>
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
