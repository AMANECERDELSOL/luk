import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Category } from '../types';
import { API_URL } from '../types';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { toggleCart, totalItems } = useCart();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        fetch(`${API_URL}/api/categories`)
            .then(r => r.json())
            .then(setCategories)
            .catch(console.error);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const isAdmin = location.pathname.startsWith('/admin');
    if (isAdmin) return null;

    return (
        <>
            <header className={`header ${scrolled ? 'scrolled' : ''}`}>
                <div className="header-main">
                    <Link to="/" className="header-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                        <img src="/images/logo.jpg" alt="Logo" style={{ height: '40px', objectFit: 'contain' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', color: 'var(--color-black)', lineHeight: 1.2 }}>
                            <span style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', margin: 0 }}>LUKA</span>
                            <span style={{ fontSize: '10px', letterSpacing: '1px', opacity: 0.8, color: 'var(--color-gold)' }}>NATURAL ELEGANCE</span>
                        </div>
                    </Link>

                    <form className="header-search" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Buscar productos, marcas..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        <span className="header-search-icon">🔍</span>
                    </form>

                    <div className="header-actions">
                        <button className="header-action-btn" onClick={toggleCart} title="Mi Bolsa">
                            👜
                            {totalItems > 0 && <span className="badge">{totalItems}</span>}
                        </button>
                        <button
                            className="mobile-menu-btn header-action-btn"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>
            </header>

            <nav className="category-nav" style={{ position: 'fixed', top: 'var(--header-height)', left: 0, right: 0, zIndex: 999 }}>
                <ul className={`category-nav-list ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    {categories.map(cat => (
                        <li key={cat.id}>
                            <Link
                                to={`/categoria/${cat.slug}`}
                                className={`category-nav-link ${location.pathname === `/categoria/${cat.slug}` ? 'active' : ''}`}
                            >
                                {cat.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
}
