import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "skan.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    is_admin INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    price INTEGER NOT NULL,
    image TEXT NOT NULL,
    rooms INTEGER NOT NULL DEFAULT 1,
    bathrooms INTEGER NOT NULL DEFAULT 1,
    area INTEGER NOT NULL DEFAULT 50,
    tags TEXT DEFAULT '[]',
    owner_name TEXT DEFAULT '',
    owner_phone TEXT DEFAULT '',
    description TEXT DEFAULT '',
    available INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    property_id INTEGER NOT NULL,
    property_title TEXT NOT NULL,
    property_price INTEGER NOT NULL,
    owner_name TEXT DEFAULT 'المالك',
    status TEXT DEFAULT 'pending',
    brokerage_paid INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    role TEXT DEFAULT 'admin',
    granted_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (granted_by) REFERENCES users(id)
  );
`);

// Seed properties if empty
const count = db.prepare("SELECT COUNT(*) as c FROM properties").get() as { c: number };
if (count.c === 0) {
  const insert = db.prepare(`
    INSERT INTO properties (title, address, city, price, image, rooms, bathrooms, area, tags, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const seedData = [
    {
      title: "شقة سكنية حديثة",
      address: "شارع الجامعة، مدينتي",
      city: "القاهرة الجديدة",
      price: 8200,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
      rooms: 3, bathrooms: 2, area: 120,
      tags: '["عقار جديد","مؤثثة","قريبة من الجامعة"]',
      description: "شقة سكنية حديثة ومجهزة بالكامل في القاهرة الجديدة. مناسبة للطلاب والعوائل.",
    },
    {
      title: "أستوديو راقٍ",
      address: "متفرع من شارع التسعين",
      city: "مدينة الشروق",
      price: 5000,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
      rooms: 1, bathrooms: 1, area: 55,
      tags: '["مؤثثة","طلاب","أمان"]',
      description: "أستوديو مجهز بالكامل مناسب لطالب جامعي. أمان 24 ساعة.",
    },
    {
      title: "شقة بغرفتين وشرفة",
      address: "حي بدر الأول",
      city: "مدينة بدر",
      price: 6500,
      image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
      rooms: 2, bathrooms: 1, area: 90,
      tags: '["شرفة","عائلي","قريبة من الجامعة"]',
      description: "شقة مريحة بغرفتين مع شرفة. مناسبة للعائلات والطلاب.",
    },
    {
      title: "شقة فاخرة بالكامل",
      address: "كمبوند الخضرة",
      city: "القاهرة الجديدة",
      price: 12000,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
      rooms: 4, bathrooms: 3, area: 180,
      tags: '["فاخرة","كمبوند","خدمات"]',
      description: "شقة فاخرة في كمبوند متكامل الخدمات.anjuman security and cleaning.",
    },
    {
      title: "غرفة مشتركة للطلاب",
      address: "شارع الجامعة",
      city: "الشروق",
      price: 2200,
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80",
      rooms: 1, bathrooms: 1, area: 25,
      tags: '["طلاب","اقتصادية","قريبة"]',
      description: "غرفة مشتركة اقتصادية على بعد دقائق من الجامعة.",
    },
    {
      title: "شقة عائلية واسعة",
      address: "الحي الثالث",
      city: "مدينتي",
      price: 9800,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
      rooms: 3, bathrooms: 2, area: 140,
      tags: '["مؤثثة","عائلية","مكيفة"]',
      description: "شقة عائلية واسعة ومكيفة بالكامل في مدينتي.",
    },
  ];

  const insertMany = db.transaction(() => {
    for (const p of seedData) {
      insert.run(p.title, p.address, p.city, p.price, p.image, p.rooms, p.bathrooms, p.area, p.tags, p.description);
    }
  });
  insertMany();
  console.log("[DB] Seeded 6 properties");
}

export default db;
