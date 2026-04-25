import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div>
                        <div className="footer-brand" style={{ marginBottom: '16px' }}>
                            <img src="/images/logo.jpg" alt="Luka Natural Elegance" style={{ height: '50px', objectFit: 'contain' }} />
                        </div>
                        <p className="footer-desc">
                            Tu destino de belleza premium. Descubre productos de las mejores marcas
                            para skincare, maquillaje y cuidado personal.
                        </p>
                    </div>

                    <div>
                        <div className="footer-title">Tienda</div>
                        <div className="footer-links">
                            <Link to="/categoria/skincare">Skincare</Link>
                            <Link to="/categoria/maquillaje">Maquillaje</Link>
                            <Link to="/categoria/cuidado-personal">Cuidado Personal</Link>
                            <Link to="/categoria/herramientas-accesorios">Herramientas</Link>
                        </div>
                    </div>

                    <div>
                        <div className="footer-title">Ayuda</div>
                        <div className="footer-links">
                            <a href="#">Envíos y Devoluciones</a>
                            <a href="#">Preguntas Frecuentes</a>
                            <a href="#">Contacto</a>
                            <a href="#">Términos y Condiciones</a>
                        </div>
                    </div>

                    <div>
                        <div className="footer-title">Síguenos</div>
                        <div className="footer-links">
                            <a href="#">Instagram</a>
                            <a href="#">Facebook</a>
                            <a href="#">TikTok</a>
                            <a href="#">WhatsApp</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <span>© {new Date().getFullYear()} Luka Natural Elegance. Todos los derechos reservados.</span>
                    <span>Hecho con ♥ en México</span>
                </div>
            </div>
        </footer>
    );
}
