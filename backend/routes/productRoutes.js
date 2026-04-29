//Import express and router
const express = require ("express");
const router = express.Router();

//Import controller
const productController = require ('../controllers/productController');

//Import Middleware
const  authMiddleware  = require("../middleware/authMiddleware");
const  roleMiddleware  = require("../middleware/roleMiddleware");

//GET

//1. Read a specific product
router.get("/:id", authMiddleware, productController.getProductById);

//2. Read products
router.get("/", authMiddleware, productController.getProducts);

//POST

//3. Create a new product
//ONLY the "Producer" can create a new product 
router.post("/", authMiddleware, roleMiddleware("Producer"), productController.createProduct);

//PUT

//4. Update an existing product
//ONLY the "Producer" can update an existing product
router.put("/:id", authMiddleware, roleMiddleware("Producer"), productController.updateProduct);

//DELETE

//5. Delete an existing product
//ONLY the "Producer" can delete an existing product 
router.delete("/:id", authMiddleware, roleMiddleware("Producer"), productController.deleteProduct);

module.exports= router;