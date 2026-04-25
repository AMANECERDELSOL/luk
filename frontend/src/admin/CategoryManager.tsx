import { useState, useEffect } from 'react';
import type { Category } from '../types';
import { API_URL } from '../types';

export default function CategoryManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const [form, setForm] = useState({ name: '', description: '', sort_order: '' });
    const [toast, setToast] = useState('');

    const fetchCategories = () => {
        fetch(`${API_URL}/api/categories`).then(r => r.json()).then(setCategories).catch(console.error);
    };

    useEffect(() => { fetchCategories(); }, []);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const resetForm = () => {
        setForm({ name: '', description: '', sort_order: '' });
        setEditing(null);
        setShowForm(false);
    };

    const startEdit = (cat: Category) => {
        setEditing(cat);
        setForm({ name: cat.name, description: cat.description, sort_order: String(cat.sort_order) });
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('sort_order', form.sort_order || '0');

        const url = editing ? `${API_URL}/api/admin/categories/${editing.id}` : `${API_URL}/api/admin/categories`;
        const method = editing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, { method, body: formData });
            if (res.ok) {
                showToast(editing ? 'Categoría actualizada ✓' : 'Categoría creada ✓');
                resetForm();
                fetchCategories();
            }
        } catch {
            showToast('Error de conexión');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar esta categoría? Los productos no serán eliminados.')) return;
        try {
            await fetch(`${API_URL}/api/admin/categories/${id}`, { method: 'DELETE' });
            showToast('Categoría eliminada');
            fetchCategories();
        } catch {
            showToast('Error al eliminar');
        }
    };

    return (
        <div>
            <div className="admin-header">
                <h1>{showForm ? (editing ? 'Editar Categoría' : 'Nueva Categoría') : 'Categorías'}</h1>
                {!showForm ? (
                    <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
                        + Nueva Categoría
                    </button>
                ) : (
                    <button className="btn btn-outline" onClick={resetForm}>← Volver</button>
                )}
            </div>

            {showForm ? (
                <div className="admin-card">
                    <form className="admin-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nombre *</label>
                            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                        </div>
                        <div className="form-group">
                            <label>Descripción</label>
                            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} />
                        </div>
                        <div className="form-group">
                            <label>Orden de visualización</label>
                            <input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: e.target.value }))} />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg">
                            {editing ? 'Guardar Cambios' : 'Crear Categoría'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="admin-card">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Slug</th>
                                <th>Descripción</th>
                                <th>Orden</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(cat => (
                                <tr key={cat.id}>
                                    <td><strong>{cat.name}</strong></td>
                                    <td className="text-muted">{cat.slug}</td>
                                    <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {cat.description || '—'}
                                    </td>
                                    <td>{cat.sort_order}</td>
                                    <td>
                                        <div className="actions">
                                            <button className="edit-btn" onClick={() => startEdit(cat)}>Editar</button>
                                            <button className="delete-btn" onClick={() => handleDelete(cat.id)}>Eliminar</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {toast && <div className="toast success">{toast}</div>}
        </div>
    );
}
