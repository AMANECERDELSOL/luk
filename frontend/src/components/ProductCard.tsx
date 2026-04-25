import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import { getProductImages, getImageUrl, formatPrice } from '../types';

interface Props {
    product: Product;
    index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
    const { addItem } = useCart();
    const images = getProductImages(product);
    const mainImage = images.length > 0 ? getImageUrl(images[0]) : '';
    const hasDiscount = product.compare_price > 0 && product.compare_price > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
        : 0;

    return (
        <div className={`product-card animate-fade-in-up animate-delay-${(index % 4) + 1}`}>
            <Link to={`/producto/${product.slug}`}>
                <div className="product-card-image">
                    {mainImage ? (
                        <img src={mainImage} alt={product.name} loading="lazy" />
                    ) : (
                        <div className="placeholder-product-img">✦</div>
                    )}
                    {hasDiscount && (
                        <span className="product-card-badge sale">-{discountPercent}%</span>
                    )}
                    {product.featured === 1 && !hasDiscount && (
                        <span className="product-card-badge">Destacado</span>
                    )}
                </div>
            </Link>

            <div className="product-card-overlay">
                <button
                    className="btn btn-primary btn-sm btn-full"
                    onClick={(e) => {
                        e.preventDefault();
                        addItem(product);
                    }}
                >
                    Añadir a la Bolsa
                </button>
            </div>

            <div className="product-card-info">
                <div className="product-card-brand">{product.brand}</div>
                <Link to={`/producto/${product.slug}`}>
                    <div className="product-card-name">{product.name}</div>
                </Link>
                <div className="product-card-price">
                    <span className="current">{formatPrice(product.price)}</span>
                    {hasDiscount && (
                        <span className="original">{formatPrice(product.compare_price)}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
