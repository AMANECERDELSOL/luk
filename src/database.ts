import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'data', 'store.db');

let db: Database.Database;

export function getDb(): Database.Database {
    if (!db) {
        db = new Database(DB_PATH);
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
        initTables();
    }
    return db;
}

function initTables() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT DEFAULT '',
      banner_image TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      brand TEXT DEFAULT '',
      description TEXT DEFAULT '',
      short_description TEXT DEFAULT '',
      price REAL NOT NULL DEFAULT 0,
      compare_price REAL DEFAULT 0,
      category_id INTEGER,
      images TEXT DEFAULT '[]',
      ingredients TEXT DEFAULT '',
      usage_instructions TEXT DEFAULT '',
      stock INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT DEFAULT '',
      customer_email TEXT DEFAULT '',
      address TEXT DEFAULT '',
      status TEXT DEFAULT 'pendiente',
      total REAL DEFAULT 0,
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER DEFAULT 1,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT DEFAULT ''
    );
  `);

    // Insert default settings if empty
    const count = db.prepare('SELECT COUNT(*) as c FROM settings').get() as any;
    if (count.c === 0) {
        const insert = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
        insert.run('store_name', 'LUKA NATURAL ELEGANCE');
        insert.run('store_subtitle', 'Tu destino de belleza premium');
        insert.run('currency', 'MXN');
        insert.run('whatsapp_number', '');
    }
}

export default getDb;
