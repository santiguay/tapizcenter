'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { products, categories, applications } from '../data/products';

export default function CatalogoPage() {
  const searchParams = useSearchParams();
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedApplications, setSelectedApplications] = useState([]);
  
  // State for Modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  // Initialize filters from URL query parameters if they exist
  useEffect(() => {
    const catParam = searchParams.get('category');
    const appParam = searchParams.get('app');
    
    if (catParam) {
      setSelectedCategories([catParam]);
    }
    if (appParam) {
      setSelectedApplications([appParam]);
    }
  }, [searchParams]);

  // Handle category checkbox changes
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Handle application checkbox changes
  const handleAppChange = (appId) => {
    setSelectedApplications(prev => 
      prev.includes(appId)
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  // Filter products based on search query, category, and application
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search term filter
      const matchesSearch = searchQuery.trim() === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(product.category);

      // Application filter
      const matchesApp = selectedApplications.length === 0 || 
        product.applications.some(app => selectedApplications.includes(app));

      return matchesSearch && matchesCategory && matchesApp;
    });
  }, [searchQuery, selectedCategories, selectedApplications]);

  // Open modal and pre-select the first color variant
  const openProductDetails = (product) => {
    setSelectedProduct(product);
    if (product.variants && product.variants.length > 0) {
      setSelectedColor(product.variants[0]);
    } else {
      setSelectedColor(null);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setSelectedColor(null);
  };

  // Generate WhatsApp message URL
  const whatsappUrl = useMemo(() => {
    if (!selectedProduct) return '';
    const phone = '5491100000000'; // Replace with TapizCenter actual business line
    const colorText = selectedColor ? ` en color ${selectedColor.name}` : '';
    const text = `Hola TapizCenter! Quisiera realizar una consulta por el producto "${selectedProduct.name}" (Código: ${selectedProduct.code})${colorText}.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }, [selectedProduct, selectedColor]);

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container">
        
        {/* Page Header */}
        <div style={{ marginBottom: '3rem', borderLeft: '4px solid var(--color-gold)', paddingLeft: '1.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Catálogo de Materiales</h1>
          <p style={{ color: 'var(--color-navy-light)', fontSize: '1.05rem', marginTop: '0.25rem' }}>
            Explorá nuestra línea exclusiva de telas, cuerinas y espumas seleccionadas para tapicería profesional.
          </p>
        </div>

        {/* Catalog Main Layout */}
        <div className="catalog-layout">
          
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <div className="filter-group">
              <h3 className="filter-group-title">Categorías</h3>
              <div className="filter-options">
                {categories.map(cat => (
                  <label key={cat.id} className="filter-option">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => handleCategoryChange(cat.id)}
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-group-title">Aplicaciones</h3>
              <div className="filter-options">
                {applications.map(app => (
                  <label key={app.id} className="filter-option">
                    <input 
                      type="checkbox" 
                      checked={selectedApplications.includes(app.id)}
                      onChange={() => handleAppChange(app.id)}
                    />
                    {app.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Clear filters action */}
            {(selectedCategories.length > 0 || selectedApplications.length > 0 || searchQuery !== '') && (
              <button 
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedApplications([]);
                  setSearchQuery('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-gold-dark)',
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
                  placeholder="Buscar por nombre, código o características..." 
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
                    setSelectedCategories([]);
                    setSelectedApplications([]);
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
                    <div className="product-img-placeholder">
                      <span className="product-category-badge">{product.category}</span>
                      
                      <div className="product-icon-symbol">
                        {product.category === 'Telas' && '🛋️'}
                        {product.category === 'Cuerinas' && '⛵'}
                        {product.category === 'Espumas' && '🧽'}
                        {product.category === 'Insumos' && '🧵'}
                      </div>
                      
                      <div className="product-app-badges">
                        {product.applications.map(app => (
                          <span key={app} className="product-app-badge">{app}</span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Info Section */}
                    <div className="product-info">
                      <span className="product-code">{product.code}</span>
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description-excerpt">{product.description}</p>
                      
                      {/* Quick preview swatches if available */}
                      {product.variants && product.variants.length > 0 && (
                        <div className="product-swatches">
                          {product.variants.map((v, i) => (
                            <span 
                              key={i} 
                              className="swatch-circle" 
                              style={{ backgroundColor: v.hex }} 
                              title={v.name}
                            />
                          ))}
                        </div>
                      )}

                      <div className="product-footer">
                        <span className="product-price-label">{product.price}</span>
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
              <div className="modal-img-section">
                <span className="product-category-badge" style={{ left: '20px', top: '20px' }}>
                  {selectedProduct.category}
                </span>
                <div className="modal-img-symbol">
                  {selectedProduct.category === 'Telas' && '🛋️'}
                  {selectedProduct.category === 'Cuerinas' && '⛵'}
                  {selectedProduct.category === 'Espumas' && '🧽'}
                  {selectedProduct.category === 'Insumos' && '🧵'}
                </div>
                <h3 style={{ fontSize: '1.25rem', letterSpacing: '1px' }}>{selectedProduct.code}</h3>
              </div>

              {/* Data and CTA Info */}
              <div className="modal-info-section">
                <div className="modal-title-group">
                  <span className="modal-category">{selectedProduct.category}</span>
                  <h2 className="modal-title">{selectedProduct.name}</h2>
                  <span className="modal-code">Código: {selectedProduct.code}</span>
                </div>

                <p className="modal-desc">{selectedProduct.description}</p>

                {/* Specs list */}
                {selectedProduct.specs && selectedProduct.specs.length > 0 && (
                  <div>
                    <h4 className="modal-variants-title" style={{ marginBottom: '0.5rem' }}>Especificaciones</h4>
                    <table className="modal-specs-table">
                      <tbody>
                        {selectedProduct.specs.map((spec, i) => (
                          <tr key={i}>
                            <td className="modal-specs-label">{spec.label}</td>
                            <td className="modal-specs-value">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Color Variants Swatches */}
                {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                  <div className="modal-variants-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 className="modal-variants-title">Variante / Color</h4>
                      {selectedColor && (
                        <span className="selected-variant-name">{selectedColor.name}</span>
                      )}
                    </div>
                    <div className="modal-variants-grid">
                      {selectedProduct.variants.map((v, i) => (
                        <label key={i} className="variant-swatch-wrapper">
                          <input 
                            type="radio" 
                            name="colorVariant"
                            className="variant-swatch-input"
                            checked={selectedColor?.name === v.name}
                            onChange={() => setSelectedColor(v)}
                          />
                          <span className="variant-swatch-box">
                            <span 
                              className="variant-swatch-color" 
                              style={{ backgroundColor: v.hex }}
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
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.59 1.988 14.113.96 11.5.961c-5.437 0-9.862 4.371-9.866 9.8c-.001 1.762.485 3.478 1.411 5.014L2.08 19.829l6.567-1.714.001-.001-.001-.001zM17.432 14.3c-.321-.16-1.897-.936-2.197-1.047-.3-.11-.519-.16-.738.16-.219.32-.848 1.047-1.04 1.268-.192.22-.383.245-.704.084-.321-.16-1.353-.499-2.578-1.593-.953-.85-1.597-1.9-1.784-2.22-.187-.32-.02-.493.14-.653.145-.144.322-.375.483-.563.16-.188.214-.32.321-.534.107-.214.053-.401-.026-.562-.08-.16-.738-1.777-1.012-2.441-.267-.643-.539-.556-.738-.566-.19-.01-.41-.01-.628-.01-.219 0-.575.082-.876.411-.3.328-1.15 1.124-1.15 2.741 0 1.617 1.177 3.18 1.34 3.399.164.22 2.315 3.535 5.607 4.956.783.338 1.395.54 1.872.69.786.25 1.5.215 2.066.13.63-.095 1.897-.776 2.164-1.488.267-.713.267-1.324.187-1.448-.079-.124-.296-.204-.617-.364z"/>
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
