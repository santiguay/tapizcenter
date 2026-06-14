'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  // Add global event listeners to handle mouseup/touchend outside container
  useEffect(() => {
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero animated-fade-in">
        <div className="container hero-grid">
          <div className="hero-content">
            <span className="hero-tag">Exclusividad &amp; Calidad</span>
            <h1 className="hero-title">
              Textiles que definen <span>espacios de lujo</span>
            </h1>
            <p className="hero-desc">
              Inspirados en la sofisticación y el diseño de vanguardia. Te ofrecemos telas, cuerinas e insumos premium importados para proyectos residenciales, náuticos y automotrices de alta gama.
            </p>
            <div className="hero-actions">
              <Link href="/catalogo" className="btn btn-primary">
                Ver Catálogo Completo
              </Link>
              <a href="#servicios" className="btn btn-secondary">
                Nuestros Servicios
              </a>
            </div>
          </div>
          
          <div style={{ position: 'relative', height: '100%', minHeight: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Elegant preview illustration or subtle brand monogram frame */}
            <div style={{
              width: '100%',
              maxWidth: '360px',
              height: '360px',
              border: '3px solid var(--color-gold)',
              borderRadius: '50% 10% 50% 50%',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-gold)',
              background: 'radial-gradient(circle, var(--color-navy-medium) 0%, var(--color-navy-dark) 100%)'
            }}>
              <Image 
                src="/armchair_after.png"
                alt="TapizCenter Sillón Premium"
                fill
                priority
                style={{ objectFit: 'cover', transform: 'scale(1.1)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Soluciones de Tapicería Premium</h2>
            <p className="section-subtitle">
              Suministramos materiales de los más altos estándares para que tus renovaciones sean duraderas y estéticamente perfectas.
            </p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🛋️</div>
              <h3>Living &amp; Decoración</h3>
              <p>
                Telas de pana antimanchas (Velvet), chenilles de trama gruesa y ecocueros soft. Todo lo necesario para redefinir el confort en sillones, respaldos de cama, sillas y cortinados residenciales de categoría.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">🏎️</div>
              <h3>Tapicería Automotriz</h3>
              <p>
                Cuerinas reforzadas con grabados deportivos (estilo fibra de carbono), elasticidad óptima para molduras complejas e insumos resistentes a la fricción constante y variaciones de temperatura dentro del vehículo.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">⚓</div>
              <h3>Náutica &amp; Exterior</h3>
              <p>
                Cuerinas y telas náuticas con protección UV extrema y filtros antihongos. Materiales impermeables de alta tenacidad que soportan el agua salada, la lluvia y la exposición solar permanente en yates y exteriores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Section */}
      <section id="antes-despues" className="section section-dark">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">El Arte de la Restauración</h2>
            <p className="section-subtitle">
              Arrastrá el deslizador central para comparar un sillón desgastado ("Antes") con el resultado del retapizado utilizando nuestra exclusiva Pana Velvet Real ("Después").
            </p>
          </div>

          <div className="slider-wrapper">
            <div 
              ref={containerRef}
              className="slider-container"
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            >
              {/* After image is the base */}
              <Image 
                src="/armchair_after.png" 
                alt="Sillón Revestido Después" 
                fill
                sizes="(max-width: 800px) 100vw, 800px"
                className="slider-image image-after"
              />
              <div className="slider-label label-after">Después</div>

              {/* Before image is clipped */}
              <Image 
                src="/armchair_before.png" 
                alt="Sillón Desgastado Antes" 
                fill
                sizes="(max-width: 800px) 100vw, 800px"
                className="slider-image image-before"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
              />
              <div className="slider-label label-before">Antes</div>

              {/* Handle */}
              <div 
                className="slider-handle" 
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="slider-button">
                  ↔
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/catalogo" className="btn btn-primary">
              Explorar Materiales para tu Proyecto
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
