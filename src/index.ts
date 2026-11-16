import { createServer } from "node:http";
import fs from "node:fs";
import path from "node:path";
import { db } from "./prisma/db.ts";
import bcrypt from "bcrypt";

createServer(async (req, res) => {
  // 1. Раздача статики
  if (req.method === "GET") {
    let file = req.url === "/" ? "index.html" : req.url?.slice(1);
    if (!file || file === "") file = "index.html";

    if (file.includes("..")) { res.writeHead(403); res.end(); return; }

    const filePath = path.join(process.cwd(), "public", file);

    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); res.end("Not Found"); return; }

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

  // 3. Добавление товара
  if (req.method === "POST" && req.url === "/api/products") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const { title, price, description, userId } = JSON.parse(body);
        await db.connect({ url: "postgresql://postgres:prisma@localhost:5433/shop_db" });
        const product = await db.orm.public.Product.create({
          title,
          price,
          description,
          authorId: userId,
        });
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, id: product.id }));
      } catch (e: any) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Ошибка сервера" }));
      }
    });
    return;
  }

  // 4. Если ничего не совпало
  res.writeHead(404);
  res.end("Not Found");
}).listen(3000, () => console.log("Сервер: http://localhost:3000"));
