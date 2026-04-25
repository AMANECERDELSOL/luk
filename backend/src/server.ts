import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDb } from './database.js';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import ordersRouter from './routes/orders.js';
import adminRouter from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3005;

// Middleware
// app.use(helmet({ 
//    contentSecurityPolicy: false,
//    crossOriginResourcePolicy: { policy: 'cross-origin' } 
// }));
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Initialize database
getDb();

// Routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend static files
const frontendPath = path.normalize(path.join(__dirname, '..', '..', 'frontend', 'dist'));
console.log(`[Static] Carpeta de frontend: ${frontendPath}`);

// Static assets (styles, scripts from React build)
app.use(express.static(frontendPath));

// API Router Catch-all (to avoid serving index.html for missing API endpoints)
app.use('/api', (req, res) => {
    res.status(404).json({ error: 'Endpoint API no encontrado' });
});

// Catch-all route to serve the React app (Client-side routing)
app.get('*', (req, res) => {
    // Si la petición parece ser un archivo estático (tiene punto en el final) pero no se encontró arriba, es un 404 real
    if (req.url.includes('.')) {
        console.log(`[404 Static] No se encontró el archivo: ${req.url}`);
        return res.status(404).end();
    }
    
    console.log(`[Frontend] Enviando index.html para: ${req.url}`);
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n  🛍️  LUKA NATURAL ELEGANCE — Backend corriendo en http://localhost:${PORT}`);
    console.log(`  📦  Base de datos en: ${path.join(__dirname, '..', 'data', 'store.db')}`);
    console.log(`  📸  Imágenes en: ${path.join(__dirname, '..', 'uploads')}\n`);
});
