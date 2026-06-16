'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function getColorHex(colorName) {
  if (!colorName) return '#778da9';
  const name = colorName.toLowerCase().trim();
  if (name.includes('azul real') || name.includes('royal blue')) return '#002060';
  if (name.includes('blanco polar') || name.includes('blanco nieve')) return '#FFFFFF';
  if (name.includes('beige')) return '#E1D3BE';
  if (name.includes('gris grafito') || name.includes('grafito') || name.includes('gris oscuro')) return '#4A4A4A';
  if (name.includes('azul índigo') || name.includes('indigo') || name.includes('azul marino')) return '#0A1B3A';
  if (name.includes('verde esmeralda') || name.includes('esmeralda')) return '#0B4D3A';
  if (name.includes('lino natural') || name.includes('crudo') || name.includes('natural')) return '#F5F2EB';
  if (name.includes('azul denim') || name.includes('denim')) return '#2E3033';
  return '#778da9'; // Fallback gray
}

function CatalogoContent() {
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sublines, setSublines] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSublines, setSelectedSublines] = useState([]);
  
  // State for Modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    async function loadCatalog() {
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
        console.error('Error loading catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  // Initialize filters from URL query parameters if they exist
  useEffect(() => {
    const brandParam = searchParams.get('brand');
    const subParam = searchParams.get('subline');
    
    if (brandParam) {
      setSelectedBrands([brandParam]);
    }
    if (subParam) {
      setSelectedSublines([subParam]);
    }
  }, [searchParams]);

  // Handle brand checkbox changes
  const handleBrandChange = (brandId) => {
    setSelectedBrands(prev => 
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    );
  };

  // Handle subline checkbox changes
  const handleSublineChange = (subId) => {
    setSelectedSublines(prev => 
      prev.includes(subId)
        ? prev.filter(id => id !== subId)
        : [...prev, subId]
    );
  };

  // Filter products based on search query, brand, and subline
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search term filter
      const matchesSearch = searchQuery.trim() === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        product.brand?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.subLine?.name && product.subLine.name.toLowerCase().includes(searchQuery.toLowerCase()));

      // Brand filter
      const matchesBrand = selectedBrands.length === 0 || 
        selectedBrands.includes(product.brandId);

      // Subline filter
      const matchesSubline = selectedSublines.length === 0 || 
        (product.subLineId && selectedSublines.includes(product.subLineId));

      return matchesSearch && matchesBrand && matchesSubline;
    });
  }, [products, searchQuery, selectedBrands, selectedSublines]);

  // Open modal and pre-select the first variant
  const openProductDetails = (product) => {
    setSelectedProduct(product);
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setSelectedVariant(null);
  };

  // Generate WhatsApp message URL
  const whatsappUrl = useMemo(() => {
    if (!selectedProduct) return '';
    const phone = '5491100000000'; // Replace with TapizCenter actual business line
    const variantText = selectedVariant ? ` en variante ${selectedVariant.name} (${selectedVariant.color || ''})` : '';
    const text = `Hola TapizCenter! Quisiera realizar una consulta por el producto "${selectedProduct.name}" (Marca: ${selectedProduct.brand?.name || 'TapizCenter Selection'})${variantText}.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }, [selectedProduct, selectedVariant]);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-navy-dark)', fontWeight: '600' }}>Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container">
        
        {/* Page Header */}
        <div style={{ marginBottom: '3rem', borderLeft: '4px solid var(--color-gold)', paddingLeft: '1.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Catálogo de Materiales</h1>
          <p style={{ color: 'var(--color-navy-light)', fontSize: '1.05rem', marginTop: '0.25rem' }}>
            Explorá nuestra línea exclusiva de telas, cuerinas y sintéticos premium.
          </p>
        </div>

        {/* Catalog Main Layout */}
        <div className="catalog-layout">
          
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <div className="filter-group">
              <h3 className="filter-group-title">Marcas</h3>
              <div className="filter-options">
                {brands.map(brand => (
                  <label key={brand.id} className="filter-option">
                    <input 
                      type="checkbox" 
                      checked={selectedBrands.includes(brand.id)}
                      onChange={() => handleBrandChange(brand.id)}
                    />
                    {brand.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-group-title">Sublíneas</h3>
              <div className="filter-options">
                {sublines.map(sub => (
                  <label key={sub.id} className="filter-option">
                    <input 
                      type="checkbox" 
                      checked={selectedSublines.includes(sub.id)}
                      onChange={() => handleSublineChange(sub.id)}
                    />
                    {sub.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Clear filters action */}
            {(selectedBrands.length > 0 || selectedSublines.length > 0 || searchQuery !== '') && (
              <button 
                onClick={() => {
                  setSelectedBrands([]);
                  setSelectedSublines([]);
                  setSearchQuery('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-navy-light)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginTop: '1rem',
                  textDecoration: 'underline'
                }}
              >
                Limpiar todos los filtros
              </button>
            )}
          </aside>

          {/* Catalog Results Area */}
          <div>
            <div className="catalog-content-header">
              {/* Search Bar */}
              <div className="search-bar-container">
                <svg className="search-icon-svg" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Buscar por nombre, marca o características..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Stats and Results Info */}
              <div className="catalog-stats">
                Mostrando <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong> productos
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: 'var(--color-white)', borderRadius: 'var(--border-radius-md)', border: '1px dashed var(--color-border)' }}>
                <p style={{ fontSize: '1.25rem', color: 'var(--color-navy-light)' }}>
                  No encontramos productos que coincidan con tu búsqueda.
                </p>
                <button 
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedSublines([]);
                    setSearchQuery('');
                  }}
                  className="btn btn-secondary"
                  style={{ marginTop: '1.5rem', color: 'var(--color-navy-dark)' }}
                >
                  Restaurar filtros
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <div 
                    key={product.id} 
                    className="product-card animated-slide-up"
                    onClick={() => openProductDetails(product)}
                  >
                    {/* Top image section (themed placeholder with visual cues) */}
                    <div className="product-img-placeholder" style={{
                      backgroundImage: product.image ? `url(${product.image})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}>
                      <span className="product-category-badge">{product.brand?.name}</span>
                      
                      {!product.image && (
                        <div className="product-icon-symbol">
                          {product.brand?.name.toLowerCase().includes('cipatex') ? '⛵' : '🛋️'}
                        </div>
                      )}
                      
                      <div className="product-app-badges">
                        {product.subLine && (
                          <span className="product-app-badge">{product.subLine.name}</span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Info Section */}
                    <div className="product-info">
                      <span className="product-code">{product.brand?.name}</span>
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description-excerpt">{product.description}</p>
                      
                      {/* Quick preview swatches if available */}
                      {product.variants && product.variants.length > 0 && (
                        <div className="product-swatches">
                          {product.variants.map((v, i) => (
                            <span 
                              key={i} 
                              className="swatch-circle" 
                              style={{ backgroundColor: getColorHex(v.color) }} 
                              title={`${v.name} (${v.color || ''})`}
                            />
                          ))}
                        </div>
                      )}

                      <div className="product-footer">
                        <span className="product-price-label">
                          {product.variants?.[0]?.price ? `USD ${product.variants[0].price.toFixed(2)}` : 'Consultar'}
                        </span>
                        <span className="product-cta-text">
                          Ver Detalle →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal overlay */}
      <div className={`modal-overlay ${selectedProduct ? 'open' : ''}`} onClick={closeModal}>
        {selectedProduct && (
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal} aria-label="Cerrar modal">
              ✕
            </button>
            
            <div className="modal-body">
              {/* Image / Icon banner */}
              <div className="modal-img-section" style={{
                backgroundImage: selectedProduct.image ? `url(${selectedProduct.image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}>
                <span className="product-category-badge" style={{ left: '20px', top: '20px' }}>
                  {selectedProduct.brand?.name}
                </span>
                {!selectedProduct.image && (
                  <div className="modal-img-symbol">
                    {selectedProduct.brand?.name.toLowerCase().includes('cipatex') ? '⛵' : '🛋️'}
                  </div>
                )}
              </div>

              {/* Data and CTA Info */}
              <div className="modal-info-section">
                <div className="modal-title-group">
                  <span className="modal-category">{selectedProduct.brand?.name}</span>
                  <h2 className="modal-title">{selectedProduct.name}</h2>
                  {selectedProduct.subLine && (
                    <span className="modal-code">Línea: {selectedProduct.subLine.name}</span>
                  )}
                </div>

                <p className="modal-desc">{selectedProduct.description}</p>

                {/* Technical specs */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 className="modal-variants-title" style={{ marginBottom: '0.5rem' }}>Especificaciones</h4>
                  <table className="modal-specs-table">
                    <tbody>
                      {selectedVariant?.size && (
                        <tr>
                          <td className="modal-specs-label">Dimensiones</td>
                          <td className="modal-specs-value">{selectedVariant.size}</td>
                        </tr>
                      )}
                      {selectedVariant?.sku && (
                        <tr>
                          <td className="modal-specs-label">SKU / Código</td>
                          <td className="modal-specs-value">{selectedVariant.sku}</td>
                        </tr>
                      )}
                      {selectedVariant?.color && (
                        <tr>
                          <td className="modal-specs-label">Color Seleccionado</td>
                          <td className="modal-specs-value">{selectedVariant.color}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="modal-specs-label">Disponibilidad</td>
                        <td className="modal-specs-value">
                          {selectedVariant?.stock > 0 ? `En Stock (${selectedVariant.stock} mts)` : 'Consultar Disponibilidad'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Color Variants Swatches */}
                {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                  <div className="modal-variants-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 className="modal-variants-title">Variantes Disponibles</h4>
                      {selectedVariant && (
                        <span className="selected-variant-name">{selectedVariant.name}</span>
                      )}
                    </div>
                    <div className="modal-variants-grid">
                      {selectedProduct.variants.map((v) => (
                        <label key={v.id} className="variant-swatch-wrapper">
                          <input 
                            type="radio" 
                            name="colorVariant"
                            className="variant-swatch-input"
                            checked={selectedVariant?.id === v.id}
                            onChange={() => setSelectedVariant(v)}
                          />
                          <span className="variant-swatch-box">
                            <span 
                              className="variant-swatch-color" 
                              style={{ backgroundColor: getColorHex(v.color) }}
                            />
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* WhatsApp button */}
                <div className="modal-actions">
                  <a 
                    href={whatsappUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn whatsapp-btn"
                  >
                    <svg className="whatsapp-icon-svg" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.59 1.988 14.113.96 11.5.961c-5.437 0-9.862 4.371-9.866 9.8" />
                    </svg>
                    Consultar por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={
      <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Cargando catálogo...</p>
      </div>
    }>
      <CatalogoContent />
    </Suspense>
  );
}
