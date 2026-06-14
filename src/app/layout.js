import "./globals.css";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "TapizCenter | Textiles y Cueros Exclusivos",
  description: "Descubrí la exclusiva colección de telas de pana, chenilles rústicos, cuerinas náuticas, insumos y espumas de alta densidad para tapicería premium.",
  keywords: "tapicería, telas, cuerinas, náutica, automotriz, espumas, living, tapicenter, cipatex",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {/* Premium Header */}
        <header className="header">
          <div className="container header-inner">
            <Link href="/" className="logo-link">
              <Image 
                src="/logo.svg" 
                alt="TapizCenter Logo" 
                width={200} 
                height={48} 
                priority
                style={{ objectFit: 'contain' }}
              />
            </Link>
            
            <nav className="nav">
              <Link href="/" className="nav-link">
                Inicio
              </Link>
              <Link href="/catalogo" className="nav-link">
                Catálogo
              </Link>
              <a 
                href="https://wa.me/5491100000000?text=Hola%20TapizCenter,%20quería%20hacer%20una%20consulta." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="nav-link nav-cta"
              >
                Escribinos
              </a>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main style={{ flex: '1 0 auto' }}>
          {children}
        </main>

        {/* Premium Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-column">
                <div className="footer-logo">
                  <Image 
                    src="/logo.svg" 
                    alt="TapizCenter Logo" 
                    width={180} 
                    height={44}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <p className="footer-desc">
                  Calidad premium en telas y cueros para renovar tu living, embarcación o vehículo con estilo y distinción.
                </p>
              </div>

              <div className="footer-column">
                <h4>Navegación</h4>
                <ul className="footer-links">
                  <li><Link href="/">Inicio</Link></li>
                  <li><Link href="/catalogo">Catálogo de Productos</Link></li>
                  <li><Link href="/catalogo?category=Telas">Telas Exclusivas</Link></li>
                  <li><Link href="/catalogo?category=Cuerinas">Cuerinas Especiales</Link></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Secciones</h4>
                <ul className="footer-links">
                  <li><Link href="/#servicios">Nuestros Servicios</Link></li>
                  <li><Link href="/#antes-despues">Antes &amp; Después</Link></li>
                  <li><Link href="/catalogo?app=Náutica">Náutica &amp; Exterior</Link></li>
                  <li><Link href="/catalogo?app=Automotriz">Automotriz</Link></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Contacto</h4>
                <ul className="footer-links">
                  <li className="footer-info-text">
                    📍 Av. del Libertador 4800, Palermo
                  </li>
                  <li className="footer-info-text">
                    📞 +54 9 11 0000-0000
                  </li>
                  <li className="footer-info-text">
                    ✉️ info@tapizcenter.com
                  </li>
                  <li className="footer-info-text">
                    ⏰ Lun a Vie: 9:00 a 18:00 - Sáb: 9:00 a 13:00
                  </li>
                </ul>
              </div>
            </div>

            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} TapizCenter. Todos los derechos reservados.</p>
              <div className="footer-bottom-links">
                <a href="#" style={{ pointerEvents: 'none', opacity: 0.6 }}>Términos y Condiciones</a>
                <a href="#" style={{ pointerEvents: 'none', opacity: 0.6 }}>Política de Privacidad</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
