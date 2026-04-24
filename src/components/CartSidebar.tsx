import { useCart } from '../context/CartContext';
import { getProductImages, getImageUrl, formatPrice } from '../types';

export default function CartSidebar() {
    const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal } = useCart();

    return (
        <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={closeCart}>
            <div className="cart-sidebar" onClick={e => e.stopPropagation()}>
                <div className="cart-sidebar-header">
                    <h3>Mi Bolsa ({items.length})</h3>
                    <button className="cart-close-btn" onClick={closeCart}>✕</button>
                </div>

                <div className="cart-sidebar-body">
                    {items.length === 0 ? (
                        <div className="cart-empty">
                            <div className="cart-empty-icon">👜</div>
                            <p>Tu bolsa está vacía</p>
                            <p style={{ fontSize: 12, marginTop: 8, color: 'var(--color-light-gray)' }}>
                                Descubre nuestros productos y añádelos a tu bolsa
                            </p>
                        </div>
                    ) : (
                        items.map(item => {
                            const images = getProductImages(item.product);
                            const img = images.length > 0 ? getImageUrl(images[0]) : '';
                            return (
                                <div className="cart-item" key={item.product.id}>
                                    <div className="cart-item-image">
                                        {img ? (
                                            <img src={img} alt={item.product.name} />
                                        ) : (
                                            <div className="placeholder-product-img" style={{ fontSize: 18 }}>✦</div>
                                        )}
                                    </div>
                                    <div className="cart-item-details">
                                        <div className="cart-item-brand">{item.product.brand}</div>
                                        <div className="cart-item-name">{item.product.name}</div>
                                        <div className="cart-item-price">{formatPrice(item.product.price)}</div>
                                        <div className="cart-item-actions">
                                            <div className="cart-item-qty">
                                                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>−</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                                            </div>
                                            <button className="cart-item-remove" onClick={() => removeItem(item.product.id)}>
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {items.length > 0 && (
                    <div className="cart-sidebar-footer">
                        <div className="cart-subtotal">
                            <span className="label">Subtotal</span>
                            <span className="amount">{formatPrice(subtotal)}</span>
                        </div>
                        <button className="btn btn-primary btn-full">
                            Finalizar Pedido
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
