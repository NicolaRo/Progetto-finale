import express from "express";
const router = express.Router();

import * as productController from "../controllers/productController";
import authMiddleware from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";

// GET

// 1.Get Producer's products list
router.get("/my-products", authMiddleware, productController.getProducersProducts);

// 1.1.  Read a specific product
router.get("/:id", authMiddleware, productController.getProductById);

// 2. Read products
router.get("/", authMiddleware, productController.getProducts);

// POST

// 3. Create a new product
// ONLY the "Producer" can create a new product
router.post("/", authMiddleware, roleMiddleware("Producer"), productController.createProduct);

// PUT

// 4. Update an existing product
// ONLY the "Producer" can update an existing product
router.put("/:id", authMiddleware, roleMiddleware("Producer"), productController.updateProduct);

// DELETE

// 5. Delete an existing product
// ONLY the "Producer" can delete an existing product
router.delete("/:id", authMiddleware, roleMiddleware("Producer"), productController.deleteProduct);

export default router;
module.exports = router;