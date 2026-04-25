import { Router, Request, Response } from 'express';
import { getDb } from '../database.js';

const router = Router();

// GET /api/categories
router.get('/', (_req: Request, res: Response) => {
    const db = getDb();
    const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all();
    res.json(categories);
});

// GET /api/categories/:slug
router.get('/:slug', (req: Request, res: Response) => {
    const db = getDb();
    const category = db.prepare('SELECT * FROM categories WHERE slug = ?').get(req.params.slug);
    if (!category) {
        res.status(404).json({ error: 'Categoría no encontrada' });
        return;
    }
    res.json(category);
});

export default router;
