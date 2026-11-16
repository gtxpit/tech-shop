import { createServer } from "node:http";
import fs from "node:fs";
import path from "node:path";
import { db } from "./prisma/db.ts";
import bcrypt from "bcrypt";

createServer(async (req, res) => {
  // 1. Раздача файлов (HTML, CSS, JS)
  if (req.method === "GET") {
    const file = req.url === "/" ? "registration.html" : req.url?.slice(1);
    const filePath = path.join(process.cwd(), "public", file || "");

    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); res.end(); return; }

      // Определяем тип файла
      const ext = path.extname(filePath);
      const type = ext === ".css" ? "text/css" : ext === ".js" ? "text/javascript" : "text/html";

      res.writeHead(200, { "Content-Type": type });
      res.end(data);
    });
    return;
  }

  // 2. Регистрация
  if (req.method === "POST" && req.url === "/api/register") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));

    req.on("end", async () => {
      try {
        const { name, email, password } = JSON.parse(body);

        await db.connect({ url: "postgresql://postgres:prisma@localhost:5433/shop_db" });

        const user = await db.orm.public.User.create({
          email,
          password: await bcrypt.hash(password, 10),
          name,
        });

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, id: user.id }));
      } catch (e: any) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Email уже занят" }));
      }
    });
    return;
  }
}).listen(3000, () => console.log("Сервер: http://localhost:3000"));
