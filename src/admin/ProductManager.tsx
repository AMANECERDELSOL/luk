import { useState, useEffect, useRef } from 'react';
import type { Product, Category } from '../types';
import { API_URL, getProductImages, getImageUrl, formatPrice } from '../types';

export default function ProductManager() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [editing, setEditing] = useState<Product | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [toast, setToast] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [form, setForm] = useState({
        name: '', brand: '', description: '', short_description: '',
        price: '', compare_price: '', category_id: '', ingredients: '',
        usage_instructions: '', stock: '', featured: false,
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const fetchProducts = () => {
        fetch(`${API_URL}/api/products`).then(r => r.json()).then(setProducts).catch(console.error);
    };

    useEffect(() => {
        fetchProducts();
        fetch(`${API_URL}/api/categories`).then(r => r.json()).then(setCategories).catch(console.error);
    }, []);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const resetForm = () => {
        setForm({ name: '', brand: '', description: '', short_description: '', price: '', compare_price: '', category_id: '', ingredients: '', usage_instructions: '', stock: '', featured: false });
        setSelectedFiles([]);
        setEditing(null);
        setShowForm(false);
    };

    const startEdit = (product: Product) => {
        setEditing(product);
        setForm({
            name: product.name,
            brand: product.brand,
            description: product.description,
            short_description: product.short_description,
            price: String(product.price),
            compare_price: String(product.compare_price || ''),
            category_id: String(product.category_id || ''),
            ingredients: product.ingredients,
            usage_instructions: product.usage_instructions,
            stock: String(product.stock),
            featured: product.featured === 1,
        });
        setSelectedFiles([]);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('brand', form.brand);
        formData.append('description', form.description);
        formData.append('short_description', form.short_description);
        formData.append('price', form.price);
        formData.append('compare_price', form.compare_price);
        formData.append('category_id', form.category_id);
        formData.append('ingredients', form.ingredients);
        formData.append('usage_instructions', form.usage_instructions);
        formData.append('stock', form.stock);
        formData.append('featured', form.featured ? '1' : '0');

        if (editing) {
            const existingImages = getProductImages(editing);
            formData.append('existing_images', JSON.stringify(existingImages));
        }

        for (const file of selectedFiles) {
            formData.append('images', file);
        }

        const url = editing
            ? `${API_URL}/api/admin/products/${editing.id}`
            : `${API_URL}/api/admin/products`;

        const method = editing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, { method, body: formData });
            if (res.ok) {
                showToast(editing ? 'Producto actualizado ✓' : 'Producto creado ✓');
                resetForm();
                fetchProducts();
            } else {
                const err = await res.json();
                showToast('Error: ' + err.error);
            }
        } catch (err) {
            showToast('Error de conexión');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar este producto?')) return;
        try {
            await fetch(`${API_URL}/api/admin/products/${id}`, { method: 'DELETE' });
            showToast('Producto eliminado');
            fetchProducts();
        } catch {
            showToast('Error al eliminar');
        }
    };

    return (
        <div>
            <div className="admin-header">
                <h1>{showForm ? (editing ? 'Editar Producto' : 'Nuevo Producto') : 'Productos'}</h1>
                {!showForm ? (
                    <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
                        + Nuevo Producto
                    </button>
                ) : (
                    <button className="btn btn-outline" onClick={resetForm}>
                        ← Volver
                    </button>
                )}
            </div>

            {showForm ? (
                <div className="admin-card">
                    <form className="admin-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nombre del Producto *</label>
                                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                            </div>
                            <div className="form-group">
                                <label>Marca</label>
                                <input value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Descripción Corta</label>
                            <input value={form.short_description} onChange={e => setForm(p => ({ ...p, short_description: e.target.value }))} />
                        </div>

                        <div className="form-group">
                            <label>Descripción Completa</label>
                            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4} />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Precio *</label>
                                <input type="number" step="0.01" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} required />
                            </div>
                            <div className="form-group">
                                <label>Precio Anterior (tachado)</label>
                                <input type="number" step="0.01" value={form.compare_price} onChange={e => setForm(p => ({ ...p, compare_price: e.target.value }))} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Categoría</label>
                                <select value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))}>
                                    <option value="">Sin categoría</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Stock</label>
                                <input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Ingredientes</label>
                            <textarea value={form.ingredients} onChange={e => setForm(p => ({ ...p, ingredients: e.target.value }))} rows={3} />
                        </div>

                        <div className="form-group">
                            <label>Modo de Uso</label>
                            <textarea value={form.usage_instructions} onChange={e => setForm(p => ({ ...p, usage_instructions: e.target.value }))} rows={3} />
                        </div>

                        <div className="form-group">
                            <label>Imágenes del Producto</label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                multiple
                                accept="image/*"
                                onChange={e => {
                                    if (e.target.files) setSelectedFiles(Array.from(e.target.files));
                                }}
                            />
                            <div className="image-upload-area" onClick={() => fileInputRef.current?.click()}>
                                <div className="upload-icon">📷</div>
                                <p>Haz clic para <span className="browse-text">seleccionar imágenes</span></p>
                                <p style={{ fontSize: 11, marginTop: 4 }}>JPG, PNG, WebP — Máximo 10MB</p>
                            </div>

                            {selectedFiles.length > 0 && (
                                <div className="image-preview-grid">
                                    {selectedFiles.map((file, i) => (
                                        <div key={i} className="preview-item">
                                            <img src={URL.createObjectURL(file)} alt={`Preview ${i}`} />
                                            <button className="remove-btn" onClick={() => setSelectedFiles(prev => prev.filter((_, j) => j !== i))}>✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {editing && getProductImages(editing).length > 0 && (
                                <div style={{ marginTop: 'var(--space-sm)' }}>
                                    <p style={{ fontSize: 11, color: 'var(--color-medium-gray)', marginBottom: 8 }}>Imágenes actuales:</p>
                                    <div className="image-preview-grid">
                                        {getProductImages(editing).map((img, i) => (
                                            <div key={i} className="preview-item">
                                                <img src={getImageUrl(img)} alt={`Current ${i}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-checkbox">
                                <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} />
                                Producto Destacado (aparece en la página de inicio)
                            </label>
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg">
                            {editing ? 'Guardar Cambios' : 'Crear Producto'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="admin-card">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Producto</th>
                                <th>Marca</th>
                                <th>Categoría</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => {
                                const images = getProductImages(product);
                                const thumb = images.length > 0 ? getImageUrl(images[0]) : '';
                                return (
                                    <tr key={product.id}>
                                        <td>
                                            {thumb ? (
                                                <img src={thumb} alt="" className="product-thumb" />
                                            ) : (
                                                <div className="product-thumb placeholder-product-img" style={{ fontSize: 14 }}>✦</div>
                                            )}
                                        </td>
                                        <td>
                                            <strong>{product.name}</strong>
                                            {product.featured === 1 && <span style={{ marginLeft: 8, color: 'var(--color-gold)', fontSize: 11 }}>⭐ Destacado</span>}
                                        </td>
                                        <td>{product.brand}</td>
                                        <td>{product.category_name || '—'}</td>
                                        <td>{formatPrice(product.price)}</td>
                                        <td>
                                            <span style={{ color: product.stock > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions">
                                                <button className="edit-btn" onClick={() => startEdit(product)}>Editar</button>
                                                <button className="delete-btn" onClick={() => handleDelete(product.id)}>Eliminar</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {toast && <div className="toast success">{toast}</div>}
        </div>
    );
}
