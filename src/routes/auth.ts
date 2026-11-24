import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../db.ts";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const check = await pool.query('SELECT id FROM "User" WHERE email = $1', [
      email,
    ]);
    if (check.rows.length > 0)
      return res.status(400).json({ error: "Email занят" });

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO "User" (email, password, name) VALUES ($1, $2, $3) RETURNING id',
      [email, hash, name],
    );
    res.status(201).json({ success: true, id: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM "User" WHERE email = $1', [
      email,
    ]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    res.json({ success: true, user: { id: user.id, name: user.name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};
