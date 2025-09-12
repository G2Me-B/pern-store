import express from 'express';
import cors from 'cors';
import "dotenv/config";
import helmet from 'helmet';
import morgan from 'morgan';
import productRoutes from './routes/productRoutes.js';
import { sql } from './config/db.js';

const app = express();
const PORT = process.env.PORT
// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet()); // For security headers
app.use(morgan('dev')); // For logging requests

app.use('/api/products', productRoutes);

// Db initialization 
async function initDB() {
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

        console.log("Database initialized");
    } catch (error) {
        console.error("Database connection error:", error);
    }
}


initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
});