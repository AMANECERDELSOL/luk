import { Router, Request, Response } from 'express';
import { getDb } from '../database.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (_req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        cb(null, ext && mime);
    }
});

const router = Router();

function slugify(text: string): string {
    return text.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// ─── Product CRUD ──────────────────────────────

// POST /api/admin/products
router.post('/products', upload.array('images', 5), (req: Request, res: Response) => {
    const db = getDb();
    const { name, brand, description, short_description, price, compare_price, category_id, ingredients, usage_instructions, stock, featured } = req.body;

    if (!name || !price) {
        res.status(400).json({ error: 'Nombre y precio son requeridos' });
        return;
    }

    const slug = slugify(name) + '-' + Date.now();
    const files = req.files as Express.Multer.File[];
    const images = files ? files.map(f => `/uploads/${f.filename}`) : [];

    const stmt = db.prepare(`
    INSERT INTO products (name, slug, brand, description, short_description, price, compare_price, category_id, images, ingredients, usage_instructions, stock, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

    try {
        const result = stmt.run(
            name, slug, brand || '', description || '', short_description || '',
            Number(price), Number(compare_price) || 0, category_id ? Number(category_id) : null,
            JSON.stringify(images), ingredients || '', usage_instructions || '',
            Number(stock) || 0, featured === '1' || featured === 'true' ? 1 : 0
        );

        res.status(201).json({ id: result.lastInsertRowid, slug, message: 'Producto creado' });
    } catch (err: any) {
        res.status(500).json({ error: 'Error al crear producto: ' + err.message });
    }
});

// PUT /api/admin/products/:id
router.put('/products/:id', upload.array('images', 5), (req: Request, res: Response) => {
    const db = getDb();
    const { name, brand, description, short_description, price, compare_price, category_id, ingredients, usage_instructions, stock, featured, existing_images } = req.body;

    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id) as any;
    if (!existing) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
    }

    const files = req.files as Express.Multer.File[];
    const newImages = files ? files.map(f => `/uploads/${f.filename}`) : [];
    const keepImages = existing_images ? JSON.parse(existing_images) : [];
    const allImages = [...keepImages, ...newImages];

    const slug = name ? slugify(name) + '-' + existing.id : existing.slug;

    try {
        db.prepare(`
        UPDATE products SET name=?, slug=?, brand=?, description=?, short_description=?, price=?, compare_price=?, category_id=?, images=?, ingredients=?, usage_instructions=?, stock=?, featured=?
        WHERE id=?
      `).run(
            name || existing.name, slug, brand ?? existing.brand,
            description ?? existing.description, short_description ?? existing.short_description,
            Number(price) || existing.price, Number(compare_price) || existing.compare_price,
            category_id ? Number(category_id) : existing.category_id,
            JSON.stringify(allImages.length > 0 ? allImages : JSON.parse(existing.images)),
            ingredients ?? existing.ingredients, usage_instructions ?? existing.usage_instructions,
            Number(stock) ?? existing.stock,
            featured === '1' || featured === 'true' ? 1 : (featured === '0' || featured === 'false' ? 0 : existing.featured),
            req.params.id
        );

        res.json({ message: 'Producto actualizado' });
    } catch (err: any) {
        res.status(500).json({ error: 'Error al actualizar producto: ' + err.message });
    }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', (req: Request, res: Response) => {
    const db = getDb();
    const product = db.prepare('SELECT images FROM products WHERE id = ?').get(req.params.id) as any;
    if (product) {
        // Delete image files
        const images = JSON.parse(product.images || '[]');
        for (const img of images) {
            const filePath = path.join(uploadsDir, path.basename(img));
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
    }
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ message: 'Producto eliminado' });
});

// ─── Category CRUD ──────────────────────────────

// POST /api/admin/categories
router.post('/categories', upload.single('banner_image'), (req: Request, res: Response) => {
    const db = getDb();
    const { name, description, sort_order } = req.body;

    if (!name) {
        res.status(400).json({ error: 'Nombre es requerido' });
        return;
    }

    const slug = slugify(name);
    const banner = req.file ? `/uploads/${req.file.filename}` : '';

    try {
        const result = db.prepare(
            'INSERT INTO categories (name, slug, description, banner_image, sort_order) VALUES (?, ?, ?, ?, ?)'
        ).run(name, slug, description || '', banner, Number(sort_order) || 0);

        res.status(201).json({ id: result.lastInsertRowid, slug, message: 'Categoría creada' });
    } catch (err: any) {
        if (err.message.includes('UNIQUE')) {
            res.status(400).json({ error: 'Ya existe una categoría con ese nombre' });
        } else {
            res.status(500).json({ error: 'Error al crear categoría: ' + err.message });
        }
    }
});

// PUT /api/admin/categories/:id
router.put('/categories/:id', upload.single('banner_image'), (req: Request, res: Response) => {
    const db = getDb();
    const { name, description, sort_order } = req.body;

    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id) as any;
    if (!existing) {
        res.status(404).json({ error: 'Categoría no encontrada' });
        return;
    }

    const slug = name ? slugify(name) : existing.slug;
    const banner = req.file ? `/uploads/${req.file.filename}` : existing.banner_image;

    try {
        db.prepare(
            'UPDATE categories SET name=?, slug=?, description=?, banner_image=?, sort_order=? WHERE id=?'
        ).run(name || existing.name, slug, description ?? existing.description, banner, Number(sort_order) ?? existing.sort_order, req.params.id);

        res.json({ message: 'Categoría actualizada' });
    } catch (err: any) {
        if (err.message.includes('UNIQUE')) {
            res.status(400).json({ error: 'Ya existe una categoría con ese nombre' });
        } else {
            res.status(500).json({ error: 'Error al actualizar categoría: ' + err.message });
        }
    }
});

// DELETE /api/admin/categories/:id
router.delete('/categories/:id', (req: Request, res: Response) => {
    const db = getDb();
    db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
    res.json({ message: 'Categoría eliminada' });
});

// ─── Settings ──────────────────────────────

router.get('/settings', (_req: Request, res: Response) => {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM settings').all() as any[];
    const settings: Record<string, string> = {};
    for (const row of rows) settings[row.key] = row.value;
    res.json(settings);
});

router.put('/settings', (req: Request, res: Response) => {
    const db = getDb();
    const settings = req.body;
    const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    const transaction = db.transaction(() => {
        for (const [key, value] of Object.entries(settings)) {
            stmt.run(key, String(value));
        }
    });
    transaction();
    res.json({ message: 'Configuración guardada' });
});

// ─── Upload single image ──────────────────────────────
router.post('/upload', upload.single('image'), (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json({ error: 'No se proporcionó imagen' });
        return;
    }
    res.json({ url: `/uploads/${req.file.filename}` });
});

export default router;
