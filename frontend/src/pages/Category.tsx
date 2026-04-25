import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import type { Product, Category } from '../types';
import { API_URL } from '../types';

export default function CategoryPage() {
    const { slug } = useParams<{ slug: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetch(`${API_URL}/api/categories/${slug}`).then(r => r.json()),
            fetch(`${API_URL}/api/products?category=${slug}`).then(r => r.json()),
        ])
            .then(([cat, prods]) => {
                setCategory(cat);
                setProducts(prods);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [slug]);

    const gradients: Record<string, string> = {
        skincare: 'linear-gradient(135deg, #f5e6d3 0%, #d4c4b0 50%, #c9a96e 100%)',
        maquillaje: 'linear-gradient(135deg, #e8c4c4 0%, #d4a0a0 50%, #b07070 100%)',
        'cuidado-personal': 'linear-gradient(135deg, #d4e8d4 0%, #b0d4b0 50%, #7ab07a 100%)',
        'herramientas-accesorios': 'linear-gradient(135deg, #d4d4e8 0%, #b0b0d4 50%, #8080b0 100%)',
    };

    return (
        <main>
            <section className="category-banner">
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: gradients[slug || ''] || gradients.skincare,
                    }}
                />
                <div className="category-banner-overlay" />
                <div className="category-banner-content animate-fade-in-up">
                    <h1>{category?.name || 'Cargando...'}</h1>
                    {category && <p>{category.description}</p>}
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div style={{ marginBottom: 'var(--space-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p className="text-muted" style={{ fontSize: 13 }}>
                            {products.length} producto{products.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {loading ? (
                        <div className="product-grid">
                            {[1, 2, 3, 4, 5, 6].map(i => (
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
                            <p>No hay productos en esta categoría todavía.</p>
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
