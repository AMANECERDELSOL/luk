import { useState, useEffect } from 'react';
import { API_URL } from '../types';

export default function Dashboard() {
    const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, revenue: 0 });

    useEffect(() => {
        Promise.all([
            fetch(`${API_URL}/api/products`).then(r => r.json()),
            fetch(`${API_URL}/api/categories`).then(r => r.json()),
            fetch(`${API_URL}/api/orders`).then(r => r.json()),
        ])
            .then(([products, categories, orders]) => {
                const revenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
                setStats({
                    products: products.length,
                    categories: categories.length,
                    orders: orders.length,
                    revenue,
                });
            })
            .catch(console.error);
    }, []);

    return (
        <div>
            <div className="admin-header">
                <h1>Dashboard</h1>
                <span className="text-muted" style={{ fontSize: 13 }}>
                    Bienvenido al panel de administración
                </span>
            </div>

            <div className="admin-stat-grid">
                <div className="admin-stat-card">
                    <div className="stat-value">{stats.products}</div>
                    <div className="stat-label">Productos</div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-value">{stats.categories}</div>
                    <div className="stat-label">Categorías</div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-value">{stats.orders}</div>
                    <div className="stat-label">Pedidos</div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-value" style={{ color: 'var(--color-gold)' }}>
                        ${stats.revenue.toLocaleString()}
                    </div>
                    <div className="stat-label">Ingresos</div>
                </div>
            </div>

            <div className="admin-card" style={{ marginTop: 'var(--space-xl)' }}>
                <h3 style={{ marginBottom: 'var(--space-md)' }}>Guía Rápida</h3>
                <div style={{ color: 'var(--color-dark-gray)', fontSize: 13, lineHeight: 2 }}>
                    <p>📦 <strong>Productos:</strong> Agrega, edita o elimina productos de tu catálogo.</p>
                    <p>🏷️ <strong>Categorías:</strong> Organiza tus productos en categorías.</p>
                    <p>🛒 <strong>Pedidos:</strong> Revisa y gestiona los pedidos de tus clientes.</p>
                    <p>📸 <strong>Imágenes:</strong> Sube fotos directamente desde el formulario de producto.</p>
                </div>
            </div>
        </div>
    );
}
