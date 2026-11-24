import type { Request, Response } from 'express'
import { pool } from '../db.ts'

export const getProducts = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM "Product" ORDER BY id DESC')
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Ошибка сервера" })
  }
}

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { title, price, image, authorId } = req.body
    const result = await pool.query(
      'INSERT INTO "Product" (title, price, image, "authorId") VALUES ($1, $2, $3, $4) RETURNING id',
      [title, price, image, authorId]
    )
    res.status(201).json({ success: true, id: result.rows[0].id })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Ошибка сервера" })
  }
}