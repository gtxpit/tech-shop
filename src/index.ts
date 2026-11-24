import express from 'express'
import { register, login } from './routes/auth.ts'
import { getProducts, addProduct } from './routes/products.ts'

const app = express()
app.use(express.json())
app.use(express.static('public'))

app.post('/api/register', register)
app.post('/api/login', login)
app.get('/api/products', getProducts)
app.post('/api/products', addProduct)

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/public/html/index.html')
})

app.listen(3000, () => console.log("Сервер: http://localhost:3000"))