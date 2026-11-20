import express from 'express';
import bcrypt from 'bcrypt';
import { pool } from './db.ts';

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('ДАННЫЕ:', { name, email });
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO "User" (email, password, name) VALUES ($1, $2, $3) RETURNING id',
      [email, hash, name]
    );
    res.status(201).json({ success: true, id: result.rows[0].id });
  } catch (error) {
    console.error('ОШИБКА БД:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Сервер: http://localhost:3000'));
