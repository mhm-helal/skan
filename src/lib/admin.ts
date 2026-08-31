import jwt from "jsonwebtoken";
import { getDB } from "./db";

export async function getAdminUser(req: Request) {
  const token = req.headers
    .get("cookie")
    ?.split("token=")[1]
    ?.split(";")[0];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
      name: string;
    };

    const db = await getDB();
    const result = await db.execute({ sql: "SELECT role FROM admins WHERE user_id = ?", args: [decoded.id] });
    const admin = result.rows[0] as unknown as { role: string } | undefined;

    if (!admin) return null;

    return { ...decoded, role: admin.role };
  } catch {
    return null;
  }
}

export async function isMainAdmin(userId: number) {
  const db = await getDB();
  const result = await db.execute({ sql: "SELECT role FROM admins WHERE user_id = ?", args: [userId] });
  const admin = result.rows[0] as unknown as { role: string } | undefined;
  return admin?.role === "main";
}
