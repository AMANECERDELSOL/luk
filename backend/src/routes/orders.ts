import { Router, Request, Response } from 'express';
import { getDb } from '../database.js';

const router = Router();

// POST /api/orders — create a new order
router.post('/', (req: Request, res: Response) => {
    const db = getDb();
    const { customer_name, customer_phone, customer_email, address, notes, items } = req.body;

    if (!customer_name || !items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: 'Nombre del cliente e items son requeridos' });
        return;
    }

    const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    const insertOrder = db.prepare(`
    INSERT INTO orders (customer_name, customer_phone, customer_email, address, notes, total)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

    const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
    VALUES (?, ?, ?, ?, ?)
  `);

    const updateStock = db.prepare(`
    UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?
  `);

    const transaction = db.transaction(() => {
        const result = insertOrder.run(
            customer_name,
            customer_phone || '',
            customer_email || '',
            address || '',
            notes || '',
            total
        );
        const orderId = result.lastInsertRowid;

        for (const item of items) {
            insertItem.run(orderId, item.product_id, item.product_name, item.quantity, item.price);
            updateStock.run(item.quantity, item.product_id, item.quantity);
        }

        return orderId;
    });

    try {
        const orderId = transaction();
        res.status(201).json({ id: orderId, message: 'Pedido creado exitosamente' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/orders — list all orders (admin)
router.get('/', (_req: Request, res: Response) => {
    const db = getDb();
    const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    res.json(orders);
});

// GET /api/orders/:id — single order with items
router.get('/:id', (req: Request, res: Response) => {
    const db = getDb();
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) {
        res.status(404).json({ error: 'Pedido no encontrado' });
        return;
    }
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(req.params.id);
    res.json({ ...order as any, items });
});

// PATCH /api/orders/:id — update order status
router.patch('/:id', (req: Request, res: Response) => {
    const db = getDb();
    const { status } = req.body;
    if (!status) {
        res.status(400).json({ error: 'Status es requerido' });
        return;
    }
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ message: 'Status actualizado' });
});

export default router;
