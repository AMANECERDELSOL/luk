import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';
import { API_URL } from '../types';

export default function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!query) {
            setProducts([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        fetch(`${API_URL}/api/products?search=${encodeURIComponent(query)}`)
            .then(r => r.json())
            .then(setProducts)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [query]);

    return (
        <main>
            <div className="category-banner" style={{ height: 200 }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1a1a1a, #4a4a4a)' }} />
                <div className="category-banner-overlay" />
                <div className="category-banner-content">
                    <h1>Resultados para "{query}"</h1>
                    <p>{products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}</p>
                </div>
            </div>

            <section className="section">
                <div className="container">
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
                    ) : products.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--color-medium-gray)' }}>
                            <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
                            <h3>No encontramos resultados para "{query}"</h3>
                            <p style={{ marginTop: 8 }}>Intenta con otro término de búsqueda</p>
                        </div>
                    ) : (
                        <div className="product-grid">
                            {products.map((product, i) => (
                                <ProductCard key={product.id} product={product} index={i} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
