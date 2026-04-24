import { NavLink, Outlet, Link } from 'react-router-dom';

export default function AdminLayout() {
    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-logo">
                    LUKA <span>NATURAL ELEGANCE</span>
                </div>
                <div className="admin-sidebar-subtitle">Panel de Administración</div>

                <nav>
                    <NavLink to="/admin" end className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">📊</span>
                        Dashboard
                    </NavLink>
                    <NavLink to="/admin/productos" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">📦</span>
                        Productos
                    </NavLink>
                    <NavLink to="/admin/categorias" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">🏷️</span>
                        Categorías
                    </NavLink>
                    <NavLink to="/admin/pedidos" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">🛒</span>
                        Pedidos
                    </NavLink>
                </nav>

                <Link to="/" className="admin-back-link">
                    ← Volver a la Tienda
                </Link>
            </aside>

            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}
