import { getDb } from './database.js';

const db = getDb();

console.log('🌱 Seeding database...\n');

// Clear existing data
db.exec('DELETE FROM order_items');
db.exec('DELETE FROM orders');
db.exec('DELETE FROM products');
db.exec('DELETE FROM categories');

// ─── Categories ──────────────────────────────
const insertCategory = db.prepare(
    'INSERT INTO categories (name, slug, description, banner_image, sort_order) VALUES (?, ?, ?, ?, ?)'
);

const categories = [
    { name: 'Skincare', slug: 'skincare', description: 'Limpiadores, tónicos, sueros y cremas para el cuidado de tu piel', banner_image: '/images/serum.jpg', sort_order: 1 },
    { name: 'Maquillaje', slug: 'maquillaje', description: 'Rostro, ojos y labios — resalta tu belleza natural', banner_image: '/images/maquillaje.jpg', sort_order: 2 },
    { name: 'Cuidado Personal', slug: 'cuidado-personal', description: 'Cuerpo, cabello y fragancias para tu bienestar diario', banner_image: '/images/cuidado-personal.jpg', sort_order: 3 },
    { name: 'Perfumería', slug: 'perfumeria', description: 'Fragancias exquisitas y aromas que definen tu identidad', banner_image: '/images/perfumeria.jpg', sort_order: 4 },
];

const categoryIds: Record<string, number> = {};
for (const cat of categories) {
    const result = insertCategory.run(cat.name, cat.slug, cat.description, cat.banner_image, cat.sort_order);
    categoryIds[cat.slug] = Number(result.lastInsertRowid);
}

console.log(`✅ ${categories.length} categorías creadas`);

// ─── Products ──────────────────────────────
const insertProduct = db.prepare(`
  INSERT INTO products (name, slug, brand, description, short_description, price, compare_price, category_id, images, ingredients, usage_instructions, stock, featured)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const products = [
    // Skincare
    {
        name: 'Sérum Vitamina C Luminoso',
        slug: 'serum-vitamina-c-luminoso',
        brand: 'GLOW LAB',
        description: 'Sérum facial concentrado con 20% de Vitamina C pura y Ácido Hialurónico. Ilumina, unifica el tono y protege contra los radicales libres. Textura ligera y de rápida absorción, ideal para todo tipo de piel.',
        short_description: 'Ilumina y unifica tu tono con Vitamina C pura al 20%',
        price: 890,
        compare_price: 1200,
        category_id: categoryIds['skincare'],
        images: '["/images/serum.jpg"]',
        ingredients: 'Ácido Ascórbico (Vitamina C) 20%, Ácido Hialurónico, Vitamina E, Ácido Ferúlico, Agua Purificada, Glicerina Vegetal',
        usage_instructions: 'Aplicar 3-4 gotas sobre el rostro limpio y seco por las mañanas. Dejar absorber y continuar con tu crema hidratante y protector solar.',
        stock: 45,
        featured: 1,
    },
    {
        name: 'Crema Hidratante Noche Rose',
        slug: 'crema-hidratante-noche-rose',
        brand: 'LÚMINE',
        description: 'Crema nocturna ultra-hidratante enriquecida con extracto de rosa mosqueta y retinol. Regenera tu piel mientras duermes, reduciendo líneas finas y devolviendo la luminosidad.',
        short_description: 'Regeneración nocturna con rosa mosqueta y retinol',
        price: 1250,
        compare_price: 1600,
        category_id: categoryIds['skincare'],
        images: '[]',
        ingredients: 'Rosa Mosqueta, Retinol 0.5%, Aceite de Jojoba, Manteca de Karité, Niacinamida, Péptidos de Colágeno',
        usage_instructions: 'Aplicar generosamente sobre rostro y cuello limpios cada noche. Masajear con movimientos ascendentes hasta su total absorción.',
        stock: 30,
        featured: 1,
    },
    {
        name: 'Tónico Facial Pore Refine',
        slug: 'tonico-facial-pore-refine',
        brand: 'SKIN THEORY',
        description: 'Tónico astringente con ácido salicílico y extracto de hamamelis. Minimiza los poros, controla el exceso de grasa y prepara la piel para los tratamientos posteriores.',
        short_description: 'Minimiza poros y controla la grasa',
        price: 520,
        compare_price: 0,
        category_id: categoryIds['skincare'],
        images: '[]',
        ingredients: 'Ácido Salicílico 2%, Extracto de Hamamelis, Niacinamida, Agua de Rosas, Alantoína',
        usage_instructions: 'Después de la limpieza, aplicar con un algodón sobre todo el rostro evitando el contorno de ojos. Usar mañana y noche.',
        stock: 60,
        featured: 0,
    },
    {
        name: 'Limpiador Gel Purificante',
        slug: 'limpiador-gel-purificante',
        brand: 'GLOW LAB',
        description: 'Gel limpiador suave formulado con extractos botánicos y ácido glicólico. Elimina impurezas y maquillaje sin resecar la piel, dejándola fresca y luminosa.',
        short_description: 'Limpieza profunda sin resecar',
        price: 420,
        compare_price: 0,
        category_id: categoryIds['skincare'],
        images: '[]',
        ingredients: 'Ácido Glicólico 5%, Aloe Vera, Extracto de Té Verde, Vitamina B5, Agua Micelar',
        usage_instructions: 'Aplicar sobre el rostro húmedo masajeando en círculos. Enjuagar con agua tibia. Usar mañana y noche.',
        stock: 75,
        featured: 0,
    },

    // Maquillaje
    {
        name: 'Base Fluida Velvet Skin',
        slug: 'base-fluida-velvet-skin',
        brand: 'NOIR BEAUTÉ',
        description: 'Base de maquillaje de cobertura media a alta con acabado aterciopelado. Formulada con pigmentos micronizados que se funden con la piel para un resultado natural y de larga duración (hasta 16 horas).',
        short_description: 'Cobertura media-alta con acabado aterciopelado, 16h',
        price: 780,
        compare_price: 980,
        category_id: categoryIds['maquillaje'],
        images: '[]',
        ingredients: 'Agua, Dimeticona, Dióxido de Titanio, Óxidos de Hierro, Ácido Hialurónico, Vitamina E',
        usage_instructions: 'Aplicar con brocha, esponja o dedos desde el centro del rostro hacia afuera. Construir cobertura según se desee.',
        stock: 40,
        featured: 1,
    },
    {
        name: 'Paleta de Sombras Golden Hour',
        slug: 'paleta-sombras-golden-hour',
        brand: 'NOIR BEAUTÉ',
        description: 'Paleta de 12 sombras de ojos en tonos cálidos y dorados. Incluye acabados mate, satinados y glitter. Pigmentación intensa y textura sedosa que se difumina sin esfuerzo.',
        short_description: '12 sombras en tonos cálidos dorados',
        price: 650,
        compare_price: 850,
        category_id: categoryIds['maquillaje'],
        images: '[]',
        ingredients: 'Mica, Talco, Dimeticona, Pigmentos Minerales, Vitamina E, Aceite de Argán',
        usage_instructions: 'Aplicar con brocha sobre el párpado. Usar los tonos más claros como iluminador y los oscuros para definir la cuenca. Ideal para looks de día a noche.',
        stock: 35,
        featured: 1,
    },
    {
        name: 'Labial Matte Luxury Rouge',
        slug: 'labial-matte-luxury-rouge',
        brand: 'LÚMINE',
        description: 'Labial líquido de acabado mate ultra-confortable. Fórmula enriquecida con aceite de jojoba que hidrata mientras da color intenso de larga duración. No transfiere ni reseca.',
        short_description: 'Mate intenso que no reseca, larga duración',
        price: 380,
        compare_price: 0,
        category_id: categoryIds['maquillaje'],
        images: '[]',
        ingredients: 'Aceite de Jojoba, Cera de Abeja, Vitamina E, Manteca de Karité, Pigmentos de Alta Definición',
        usage_instructions: 'Aplicar directamente sobre los labios comenzando por el centro. Para mayor precisión, delinear primero con un lápiz de labios.',
        stock: 80,
        featured: 0,
    },
    {
        name: 'Máscara de Pestañas Volume Intense',
        slug: 'mascara-pestanas-volume-intense',
        brand: 'SKIN THEORY',
        description: 'Máscara de pestañas con cepillo de fibras que separa y da volumen extremo. Fórmula resistente al agua con queratina y pantenol para fortalecer las pestañas.',
        short_description: 'Volumen extremo resistente al agua',
        price: 320,
        compare_price: 450,
        category_id: categoryIds['maquillaje'],
        images: '[]',
        ingredients: 'Queratina, Pantenol, Cera de Carnaúba, Fibras de Nylon, Pigmento Negro de Carbón',
        usage_instructions: 'Aplicar desde la raíz de las pestañas con movimientos en zigzag hacia las puntas. Aplicar 2 capas para mayor volumen.',
        stock: 55,
        featured: 0,
    },

    // Cuidado Personal
    {
        name: 'Aceite Corporal Gold Elixir',
        slug: 'aceite-corporal-gold-elixir',
        brand: 'LÚMINE',
        description: 'Aceite seco corporal con partículas doradas de mica. Hidrata profundamente mientras deja un brillo sutil y elegante en la piel. Enriquecido con aceite de argán, almendras y vitamina E.',
        short_description: 'Hidratación con brillo dorado sutil',
        price: 720,
        compare_price: 950,
        category_id: categoryIds['cuidado-personal'],
        images: '[]',
        ingredients: 'Aceite de Argán, Aceite de Almendras Dulces, Vitamina E, Mica Dorada, Escualano, Aceite de Rosa',
        usage_instructions: 'Aplicar sobre la piel húmeda después del baño. Masajear con movimientos circulares hasta su absorción. Ideal para hombros, piernas y escote.',
        stock: 25,
        featured: 1,
    },
    {
        name: 'Shampoo Reparador Keratina Pro',
        slug: 'shampoo-reparador-keratina-pro',
        brand: 'GLOW LAB',
        description: 'Shampoo profesional con queratina hidrolizada y proteínas de seda. Repara el cabello dañado, reduce el frizz y aporta brillo intenso desde la primera aplicación.',
        short_description: 'Reparación con queratina y proteínas de seda',
        price: 380,
        compare_price: 0,
        category_id: categoryIds['cuidado-personal'],
        images: '[]',
        ingredients: 'Queratina Hidrolizada, Proteínas de Seda, Aceite de Coco, Pantenol, Aloe Vera, Biotina',
        usage_instructions: 'Aplicar sobre el cabello mojado, masajear y dejar actuar 2 minutos. Enjuagar abundantemente. Usar con el acondicionador de la misma línea.',
        stock: 50,
        featured: 0,
    },
    {
        name: 'Eau de Parfum Fleur Noire',
        slug: 'eau-de-parfum-fleur-noire',
        brand: 'NOIR BEAUTÉ',
        description: 'Fragancia oriental floral con notas de jazmín negro, vainilla de Madagascar y sándalo. Elegante y misteriosa, perfecta para la noche. Concentración Eau de Parfum para mayor duración.',
        short_description: 'Oriental floral con jazmín negro y vainilla',
        price: 1850,
        compare_price: 2300,
        category_id: categoryIds['cuidado-personal'],
        images: '["/images/perfumeria.jpg"]',
        ingredients: 'Notas de salida: Pimienta Rosa, Bergamota. Notas de corazón: Jazmín Negro, Rosa Turca. Notas de fondo: Vainilla de Madagascar, Sándalo, Ámbar.',
        usage_instructions: 'Aplicar en los puntos de pulso: muñecas, cuello y detrás de las orejas. No frotar, dejar que la fragancia se desarrolle naturalmente.',
        stock: 20,
        featured: 1,
    },

    // Herramientas y Accesorios
    {
        name: 'Set de Brochas Profesional (12 piezas)',
        slug: 'set-brochas-profesional-12',
        brand: 'ARTISTRY TOOLS',
        description: 'Set completo de 12 brochas de maquillaje con cerdas sintéticas ultra-suaves. Incluye brochas para base, polvo, contorno, sombras, difuminado y labios. Mango ergonómico de madera con acabado rose gold.',
        short_description: '12 brochas profesionales con estuche',
        price: 950,
        compare_price: 1400,
        category_id: categoryIds['perfumeria'],
        images: '[]',
        ingredients: 'Cerdas: Fibra Sintética Taklon. Mango: Madera de Abedul con acabado Rose Gold. Férula: Aluminio.',
        usage_instructions: 'Lavar las brochas con jabón suave y agua tibia después de cada uso. Secar en posición horizontal. No sumergir el mango en agua.',
        stock: 18,
        featured: 0,
    },
    {
        name: 'Espejo LED de Aumento x10',
        slug: 'espejo-led-aumento-x10',
        brand: 'ARTISTRY TOOLS',
        description: 'Espejo de maquillaje con iluminación LED regulable y aumento x10 en un lado. Base antideslizante y rotación 360°. Simula luz natural para una aplicación perfecta del maquillaje.',
        short_description: 'Iluminación LED natural con aumento x10',
        price: 580,
        compare_price: 0,
        category_id: categoryIds['perfumeria'],
        images: '[]',
        ingredients: 'Material: ABS Premium, Vidrio HD, LEDs de Luz Fría/Cálida. Alimentación: USB-C recargable.',
        usage_instructions: 'Tocar el sensor táctil para encender/apagar. Mantener pulsado para ajustar la intensidad de la luz. Cargar mediante cable USB-C incluido.',
        stock: 22,
        featured: 0,
    },
    {
        name: 'Rodillo Facial Jade & Gua Sha',
        slug: 'rodillo-facial-jade-gua-sha',
        brand: 'SKIN THEORY',
        description: 'Set de rodillo facial y piedra Gua Sha de jade natural. Mejora la circulación, reduce la inflamación y ayuda a la absorción de sérums. Incluye estuche de terciopelo para almacenamiento.',
        short_description: 'Jade natural para masaje facial',
        price: 450,
        compare_price: 600,
        category_id: categoryIds['perfumeria'],
        images: '[]',
        ingredients: 'Piedra de Jade Xiuyan 100% Natural. Soporte: Acero Inoxidable. Estuche: Terciopelo.',
        usage_instructions: 'Usar sobre rostro limpio con sérum. Rodar desde el centro hacia afuera con presión suave. Guardar en el estuche. Limpiar con un paño húmedo después de cada uso.',
        stock: 30,
        featured: 1,
    },
];

for (const p of products) {
    insertProduct.run(
        p.name, p.slug, p.brand, p.description, p.short_description,
        p.price, p.compare_price, p.category_id, p.images,
        p.ingredients, p.usage_instructions, p.stock, p.featured
    );
}

console.log(`✅ ${products.length} productos creados`);
console.log('\n🎉 Base de datos inicializada correctamente!\n');
process.exit(0);
