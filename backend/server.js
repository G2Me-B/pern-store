import express from 'express';
import cors from 'cors';
import "dotenv/config";
import helmet from 'helmet';
import morgan from 'morgan';
import {
    sql
} from './config/db.js';
import {
    aj
} from './lib/arcjet.js';
import path from "path"
import productRoutes from './routes/productRoutes.js';

const app = express();
const PORT = process.env.PORT
const __dirname = path.resolve();
// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false,
})); // For security headers
app.use(morgan('dev')); // For logging requests

// Apply arcjet limits to routes
app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1 // number of requests
        })

        if (decision.isDenied()) {
            if (decision.isRateLimit()) {
                return res.status(429).json({
                    success: false,
                    message: "Too many requests - Rate limit exceeded"
                });
            } else if (decision.reason.isBot()) {
                res.status(403).json({
                    success: false,
                    message: "Access denied - Bot detected"
                });
            } else {
                res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }
            return
        }

        //  check for spoof bot
        if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            res.status(403).json({
                error: "Access denied - Spoofed bot detected"
            });
            return;
        }
        next();
    } catch (error) {
        console.log("Arcjet error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
        next(error)
    }
})

app.use('/api/products', productRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")))
    app.get("", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}

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