import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import emailRouter from './routes/emailRoute.js'
import blogRouter from './routes/blogRoute.js'
import bannerRouter from './routes/bannerRoute.js'

// App Config
const app = express()
const port = process.env.PORT
connectDB()
connectCloudinary()

// MiddleWare
app.use(express.json())
app.use(cors())

// API Endpoints
app.use('/api/user', userRouter)
app.use('/api/products', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/email', emailRouter)
app.use('/api/blog', blogRouter)
app.use('/api/banner', bannerRouter)

app.get('/', (req, res) => {
    res.send("Ancient Avenue Backend is Live")
})

app.listen(port, () => console.log('Server started on PORT : ' + port))

export default app;