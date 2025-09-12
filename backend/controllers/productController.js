import {
    sql
} from "../config/db.js"

// CRUD Operations logic

export const getAllProducts = async (req, res) => {
    try {
        const products = await sql`
        SELECT * FROM products
        ORDER BY created_at DESC`;

        console.log("Products fetched successfully ", products);
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error("Error fetching products: ", error);
        res.status(500).json({success: false, message: error.message});
    }
}


export const getProductById = async (req, res) => {
    const {id} = req.params;
    try {
        const product = await sql`
        SELECT * FROM products
        WHERE id = ${id}
        `;

         res.status(200).json({success: true,data: product });
    } catch (error) {
       console.error("Error fetching product: ", error);
        res.status(500).json({success: false, message: error.message});
    }

}

export const createProduct = async (req, res) => {
 const {name, image, price} = req.body;
 if(!name || !image || !price) {
    return res.status(400).json({success: false, message: "All fields are required"});
 }

 try {
    const newProduct =await sql`
    INSERT INTO products (name, image, price)
    VALUES (${name}, ${image}, ${price})
    RETURNING *
    `;

    console.log("Product created successfully: ", newProduct[0]);
    res.status(201).json({success: true, message: "Product created successfully"});
 } catch (error) {
    console.error("Error creating product: ", error);
     res.status(500).json({success: false, message: error.message});
 }
}

export const updateProduct = async (req, res) => {
    const {id} = req.params;
    const {name, image, price} = req.body;

    try {
       const updatedProduct= await sql`
        UPDATE products
        SET name = ${name}, image = ${image}, price = ${price}
        WHERE id = ${id}
        RETURNING *
        `;

        if(updatedProduct.length === 0) {
            return res.status(404).json({success: false, message: "Product not found"});
        }

        res.status(200).json({success: true, message: "Product updated successfully", data: updatedProduct[0]});
    } catch (error) {
    console.error("Error updating product: ", error);
     res.status(500).json({success: false, message: error.message});
    }
}

export const deleteProduct = async (req, res) => {
    const {id} = req.params;
    try {
        const deletedProduct = await sql`
        DELETE FROM products
        WHERE id = ${id}
        RETURNING *
        `;

        if(deletedProduct.length === 0) {
            return res.status(404).json({success: false, message: "Product not found"});
        }

        res.status(200).json({success: true, message: "Product deleted successfully", data: deletedProduct[0]});
    } catch (error) {
        console.error("Error updating product: ", error);
     res.status(500).json({success: false, message: error.message});
    }
}