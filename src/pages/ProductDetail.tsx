import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Accordion from '../components/Accordion';
import type { Product } from '../types';
import { API_URL, getProductImages, getImageUrl, formatPrice } from '../types';

export default function ProductDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);
    const { addItem } = useCart();

    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/api/products/${slug}`)
            .then(r => r.json())
            .then(data => {
                setProduct(data);
                setSelectedImage(0);
                setQuantity(1);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <div className="product-detail">
                <div className="container">
                    <div className="product-detail-layout">
                        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 16 }}>
                            <div><div className="skeleton" style={{ width: 80, height: 80 }} /></div>
                            <div className="skeleton" style={{ aspectRatio: '3/4' }} />
                        </div>
                        <div>
                            <div className="skeleton skeleton-text short" style={{ marginBottom: 16 }} />
                            <div className="skeleton skeleton-text" style={{ height: 32, marginBottom: 16 }} />
                            <div className="skeleton skeleton-text" style={{ height: 24, marginBottom: 32, width: '30%' }} />
                            <div className="skeleton skeleton-text" />
                            <div className="skeleton skeleton-text" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail">
                <div className="container" style={{ textAlign: 'center', padding: 'var(--space-4xl) 0' }}>
                    <p style={{ fontSize: 48, marginBottom: 16 }}>😔</p>
                    <h2>Producto no encontrado</h2>
                    <Link to="/" className="btn btn-primary" style={{ marginTop: 24 }}>
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        );
    }

    const images = getProductImages(product);
    const hasDiscount = product.compare_price > 0 && product.compare_price > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
        : 0;

    const handleAddToCart = () => {
        addItem(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const accordionItems = [
        ...(product.description ? [{ title: 'Descripción', content: product.description, defaultOpen: true }] : []),
        ...(product.usage_instructions ? [{ title: 'Modo de Uso', content: product.usage_instructions }] : []),
        ...(product.ingredients ? [{ title: 'Ingredientes', content: product.ingredients }] : []),
        {
            title: 'Envío y Devoluciones',
            content: 'Envío estándar gratuito en compras superiores a $999 MXN. Entrega en 3-5 días hábiles. Devoluciones aceptadas dentro de los primeros 30 días naturales.'
        },
    ];

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'Product',
                    name: product.name,
                    description: product.short_description || product.description,
                    brand: { '@type': 'Brand', name: product.brand },
                    image: images.map(img => `${API_URL}${img}`),
                    offers: {
                        '@type': 'Offer',
                        price: product.price,
                        priceCurrency: 'MXN',
                        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                    },
                })
            }} />

            <div className="product-detail">
                <div className="container">
                    {/* Breadcrumb */}
                    <div className="breadcrumb" style={{ fontSize: 12, color: 'var(--color-medium-gray)', marginBottom: 'var(--space-xl)', display: 'flex', gap: 8 }}>
                        <Link to="/">Inicio</Link>
                        <span>/</span>
                        {product.category_slug && (
                            <>
                                <Link to={`/categoria/${product.category_slug}`}>{product.category_name}</Link>
                                <span>/</span>
                            </>
                        )}
                        <span style={{ color: 'var(--color-black)' }}>{product.name}</span>
                    </div>

                    <div className="product-detail-layout">
                        {/* Gallery */}
                        <div className="product-gallery">
                            <div className="product-thumbnails">
                                {images.length > 0 ? (
                                    images.map((img, i) => (
                                        <div
                                            key={i}
                                            className={`product-thumbnail ${selectedImage === i ? 'active' : ''}`}
                                            onClick={() => setSelectedImage(i)}
                                        >
                                            <img src={getImageUrl(img)} alt={`${product.name} ${i + 1}`} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="product-thumbnail active">
                                        <div className="placeholder-product-img" style={{ fontSize: 18 }}>✦</div>
                                    </div>
                                )}
                            </div>

                            <div className="product-main-image">
                                {images.length > 0 ? (
                                    <img src={getImageUrl(images[selectedImage])} alt={product.name} />
                                ) : (
                                    <div className="placeholder-product-img">✦</div>
                                )}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="product-info">
                            <div className="brand-label">{product.brand}</div>
                            <h1>{product.name}</h1>

                            <div className="price-block">
                                <span className="price-current">{formatPrice(product.price)}</span>
                                {hasDiscount && (
                                    <>
                                        <span className="price-original">{formatPrice(product.compare_price)}</span>
                                        <span className="price-discount">-{discountPercent}% OFF</span>
                                    </>
                                )}
                            </div>

                            {product.short_description && (
                                <p className="short-desc">{product.short_description}</p>
                            )}

                            {/* Stock indicator */}
                            <div style={{ marginBottom: 'var(--space-lg)', fontSize: 13 }}>
                                {product.stock > 0 ? (
                                    <span style={{ color: 'var(--color-success)' }}>
                                        ● En Stock ({product.stock} disponibles)
                                    </span>
                                ) : (
                                    <span style={{ color: 'var(--color-error)' }}>● Agotado</span>
                                )}
                            </div>

                            {/* Add to Cart */}
                            <div className="add-to-cart-row">
                                <div className="quantity-selector">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                                </div>
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={handleAddToCart}
                                    disabled={product.stock <= 0}
                                    style={{ flex: 1 }}
                                >
                                    {added ? '✓ Añadido' : 'Añadir a la Bolsa'}
                                </button>
                            </div>

                            {/* Accordion Details */}
                            <Accordion items={accordionItems} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
