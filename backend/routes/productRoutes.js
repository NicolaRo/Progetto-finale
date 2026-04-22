//Import express and router
const express = require ("express");
const router = express.Router();

//Import controller
const productController = require ('../controllers/productController');

//GET

//1. Read a specific product
router.get("/:id", productController.getProductById);

//2. Read products
router.get("/", productController.getProducts);

//POST

//3. Create a new product
router.post("/", productController.createProduct);

//PUT

//4. Update an existing product
router.put("/:id", productController.updateProduct);

//DELETE

//5. Delete an existing product
router.delete("/:id", productController.deleteProduct);

module.exports= router;