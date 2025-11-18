import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'

import { connectDB } from './config/db';
import recipeRoutes from './routes/recipeRoutes'
import authRoutes from './routes/authRoutes'
import path from 'node:path';

dotenv.config()

const corsOptions = {
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_URL
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
};


connectDB()

const app = express()
app.use(express.json());
app.use(cors(corsOptions))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/recipes', recipeRoutes)
app.use('/auth', authRoutes)


export default app