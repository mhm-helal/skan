import db from "./db";

export type Property = {
  id: number;
  title: string;
  address: string;
  city: string;
  price: number;
  image: string;
  rooms: number;
  bathrooms: number;
  area: number;
  tags: string[];
  owner_name: string;
  owner_phone: string;
  description: string;
  available: number;
};

function parseTags(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  return [];
}

export function getAllProperties(): Property[] {
  const rows = db.prepare("SELECT * FROM properties ORDER BY id DESC").all() as Record<string, unknown>[];
  return rows.map((r) => ({
    id: r.id as number,
    title: r.title as string,
    address: r.address as string,
    city: r.city as string,
    price: r.price as number,
    image: r.image as string,
    rooms: r.rooms as number,
    bathrooms: r.bathrooms as number,
    area: r.area as number,
    tags: parseTags(r.tags),
    owner_name: (r.owner_name as string) || "",
    owner_phone: (r.owner_phone as string) || "",
    description: (r.description as string) || "",
    available: r.available as number,
  }));
}

export function getPropertyById(id: number): Property | undefined {
  const r = db.prepare("SELECT * FROM properties WHERE id = ?").get(id) as Record<string, unknown> | undefined;
  if (!r) return undefined;
  return {
    id: r.id as number,
    title: r.title as string,
    address: r.address as string,
    city: r.city as string,
    price: r.price as number,
    image: r.image as string,
    rooms: r.rooms as number,
    bathrooms: r.bathrooms as number,
    area: r.area as number,
    tags: parseTags(r.tags),
    owner_name: (r.owner_name as string) || "",
    owner_phone: (r.owner_phone as string) || "",
    description: (r.description as string) || "",
    available: r.available as number,
  };
}
