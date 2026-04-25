import { Router, Request, Response } from 'express';
import { getDb } from '../database.js';

const router = Router();

// GET /api/products — list products with optional filters
router.get('/', (req: Request, res: Response) => {
    const db = getDb();
    const { category, search, featured, limit } = req.query;

    let sql = `
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;
    const params: any[] = [];

    if (category) {
        sql += ' AND c.slug = ?';
        params.push(category);
    }
    if (search) {
        sql += ' AND (p.name LIKE ? OR p.brand LIKE ? OR p.description LIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term);
    }
    if (featured === '1') {
        sql += ' AND p.featured = 1';
    }

    sql += ' ORDER BY p.created_at DESC';

    if (limit) {
        sql += ' LIMIT ?';
        params.push(Number(limit));
    }

    const products = db.prepare(sql).all(...params);
    res.json(products);
});

// GET /api/products/:slug — single product
router.get('/:slug', (req: Request, res: Response) => {
    const db = getDb();
    const product = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ?
  `).get(req.params.slug);

    if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
    }
    res.json(product);
});

export default router;
