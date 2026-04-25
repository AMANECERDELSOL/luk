import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import type { Product, Category } from '../types';
import { API_URL } from '../types';

export default function Home() {
    const [featured, setFeatured] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [latest, setLatest] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch(`${API_URL}/api/products?featured=1`).then(r => r.json()),
            fetch(`${API_URL}/api/categories`).then(r => r.json()),
            fetch(`${API_URL}/api/products?limit=8`).then(r => r.json()),
        ])
            .then(([feat, cats, lat]) => {
                setFeatured(feat);
                setCategories(cats);
                setLatest(lat);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Category gradient backgrounds
    const categoryGradients = [
        'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%)',
        'linear-gradient(135deg, #e8c4c4 0%, #d4a0a0 100%)',
        'linear-gradient(135deg, #d4e8d4 0%, #c0d4c0 100%)',
        'linear-gradient(135deg, #d4d4e8 0%, #c0c0d4 100%)',
    ];

    const categoryIcons = ['✨', '💄', '🌸', '🖌️'];

    return (
        <main>
            {/* Hero Banner */}
            <section className="hero">
                <div
                    className="hero-image"
                    style={{
                        backgroundImage: 'url(/images/banner.jpg)',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                    }}
                />
                <div className="hero-overlay" />
                <div className="hero-content">
                    <p className="text-uppercase" style={{ fontSize: 12, letterSpacing: 4, marginBottom: 16, opacity: 0.8 }}>
                        Luka Natural Elegance
                    </p>
                    <h1>La Esencia de Tu Belleza Natural & Sofisticada</h1>
                    <p>
                        Productos selectos de las mejores marcas para el cuidado de tu piel,
                        maquillaje profesional y bienestar personal.
                    </p>
                    <Link to="/categoria/skincare" className="btn btn-white btn-lg">
                        Explorar Colección
                    </Link>
                </div>
            </section>

            {/* Categories Section */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <p className="text-uppercase text-gold" style={{ marginBottom: 8 }}>Categorías</p>
                        <h2>Explora Por Categoría</h2>
                        <div className="section-divider" />
                    </div>

                    <div className="category-cards">
                        {categories.map((cat, i) => (
                            <Link to={`/categoria/${cat.slug}`} key={cat.id}>
                                <div className="category-card animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            background: cat.banner_image ? `url(${cat.banner_image}) center/cover` : categoryGradients[i % categoryGradients.length],
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 64,
                                        }}
                                    >
                                        {!cat.banner_image && categoryIcons[i % categoryIcons.length]}
                                    </div>
                                    <div className="category-card-overlay">
                                        <h3>{cat.name}</h3>
                                        <span>Ver Productos →</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section" style={{ background: 'var(--color-cream)' }}>
                <div className="container">
                    <div className="section-header">
                        <p className="text-uppercase text-gold" style={{ marginBottom: 8 }}>Selección Especial</p>
                        <h2>Productos Destacados</h2>
                        <div className="section-divider" />
                    </div>

                    {loading ? (
                        <div className="product-grid">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i}>
                                    <div className="skeleton skeleton-card" />
                                    <div className="skeleton skeleton-text" />
                                    <div className="skeleton skeleton-text short" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="product-grid">
                            {featured.map((product, i) => (
                                <ProductCard key={product.id} product={product} index={i} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Latest Products */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <p className="text-uppercase text-gold" style={{ marginBottom: 8 }}>Recién Llegados</p>
                        <h2>Nuevos Lanzamientos</h2>
                        <div className="section-divider" />
                    </div>

                    <div className="product-grid">
                        {latest.slice(0, 8).map((product, i) => (
                            <ProductCard key={product.id} product={product} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Promo Banner */}
            <section
                style={{
                    background: 'var(--color-black)',
                    color: 'var(--color-white)',
                    padding: 'var(--space-3xl) 0',
                    textAlign: 'center',
                }}
            >
                <div className="container">
                    <p className="text-uppercase" style={{ color: 'var(--color-gold)', letterSpacing: 3, marginBottom: 12, fontSize: 11 }}>
                        Envío Gratis
                    </p>
                    <h2 style={{ color: 'var(--color-white)', marginBottom: 12 }}>
                        En Compras Mayores a $999
                    </h2>
                    <p style={{ color: 'var(--color-light-gray)', maxWidth: 500, margin: '0 auto' }}>
                        Disfruta de envío gratuito en todo México en compras superiores a $999 MXN.
                        Entrega en 3-5 días hábiles.
                    </p>
                </div>
            </section>
        </main>
    );
}
