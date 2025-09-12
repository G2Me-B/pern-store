import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../controllers/productController.js';


const router = express.Router();
// Get all products
router.get("/", getAllProducts)
// Get a product by ID
router.get("/:id", getProductById)
// Create a product
router.post("/", createProduct)
// Update a product
router.put("/:id", updateProduct)
// Delete a product
router.delete("/:id", deleteProduct)

export default router;