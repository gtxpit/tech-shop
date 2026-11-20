import { Pool } from 'pg'

export const pool = new Pool({
  connectionString: 'postgresql://postgres:prisma@localhost:5433/shop_db',
})