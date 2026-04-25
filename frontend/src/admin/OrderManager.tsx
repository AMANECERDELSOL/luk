import { useState, useEffect } from 'react';
import type { Order } from '../types';
import { API_URL, formatPrice } from '../types';

const STATUS_OPTIONS = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];

export default function OrderManager() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [toast, setToast] = useState('');

    const fetchOrders = () => {
        fetch(`${API_URL}/api/orders`).then(r => r.json()).then(setOrders).catch(console.error);
    };

    useEffect(() => { fetchOrders(); }, []);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const viewOrder = async (id: number) => {
        const res = await fetch(`${API_URL}/api/orders/${id}`);
        const order = await res.json();
        setSelectedOrder(order);
    };

    const updateStatus = async (id: number, status: string) => {
        try {
            await fetch(`${API_URL}/api/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            showToast('Status actualizado ✓');
            fetchOrders();
            if (selectedOrder && selectedOrder.id === id) {
                setSelectedOrder({ ...selectedOrder, status });
            }
        } catch {
            showToast('Error al actualizar');
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-MX', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div>
            <div className="admin-header">
                <h1>{selectedOrder ? `Pedido #${selectedOrder.id}` : 'Pedidos'}</h1>
                {selectedOrder && (
                    <button className="btn btn-outline" onClick={() => setSelectedOrder(null)}>← Volver</button>
                )}
            </div>

            {selectedOrder ? (
                <div>
                    <div className="admin-card">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)' }}>
                            <div>
                                <h4 style={{ marginBottom: 'var(--space-md)' }}>Información del Cliente</h4>
                                <p><strong>Nombre:</strong> {selectedOrder.customer_name}</p>
                                <p><strong>Teléfono:</strong> {selectedOrder.customer_phone || '—'}</p>
                                <p><strong>Email:</strong> {selectedOrder.customer_email || '—'}</p>
                                <p><strong>Dirección:</strong> {selectedOrder.address || '—'}</p>
                                {selectedOrder.notes && <p><strong>Notas:</strong> {selectedOrder.notes}</p>}
                            </div>
                            <div>
                                <h4 style={{ marginBottom: 'var(--space-md)' }}>Detalles del Pedido</h4>
                                <p><strong>Fecha:</strong> {formatDate(selectedOrder.created_at)}</p>
                                <p><strong>Total:</strong> {formatPrice(selectedOrder.total)}</p>
                                <div style={{ marginTop: 'var(--space-md)' }}>
                                    <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>STATUS</label>
                                    <select
                                        value={selectedOrder.status}
                                        onChange={e => updateStatus(selectedOrder.id, e.target.value)}
                                        style={{ width: 'auto' }}
                                    >
                                        {STATUS_OPTIONS.map(s => (
                                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {selectedOrder.items && selectedOrder.items.length > 0 && (
                        <div className="admin-card">
                            <h4 style={{ marginBottom: 'var(--space-md)' }}>Productos</h4>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.product_name}</td>
                                            <td>{item.quantity}</td>
                                            <td>{formatPrice(item.price)}</td>
                                            <td>{formatPrice(item.price * item.quantity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (
                <div className="admin-card">
                    {orders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--color-medium-gray)' }}>
                            <p style={{ fontSize: 48, marginBottom: 16 }}>🛒</p>
                            <p>No hay pedidos aún</p>
                        </div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Cliente</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Fecha</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td><strong>#{order.id}</strong></td>
                                        <td>{order.customer_name}</td>
                                        <td>{formatPrice(order.total)}</td>
                                        <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                                        <td>{formatDate(order.created_at)}</td>
                                        <td>
                                            <div className="actions">
                                                <button className="edit-btn" onClick={() => viewOrder(order.id)}>Ver</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {toast && <div className="toast success">{toast}</div>}
        </div>
    );
}
