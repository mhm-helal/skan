import jwt from "jsonwebtoken";
import db from "./db";

export function getAdminUser(req: Request) {
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

    // Check if user is admin
    const admin = db.prepare("SELECT role FROM admins WHERE user_id = ?").get(decoded.id) as
      | { role: string }
      | undefined;

    if (!admin) return null;

    return { ...decoded, role: admin.role };
  } catch {
    return null;
  }
}

export function isMainAdmin(userId: number) {
  const admin = db.prepare("SELECT role FROM admins WHERE user_id = ?").get(userId) as
    | { role: string }
    | undefined;
  return admin?.role === "main";
}
