import express from 'express';
import { createProduct, getAllProducts } from '../controllers/productController.js';


const router = express.Router();
// Get all products
router.get("/", getAllProducts)

// Create a product
router.post("/", createProduct)

export default router;