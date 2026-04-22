//Import express and router
const express = require ("express");
const router = express.Router();

//Import controller
const orderController = require('../controllers/orderController');

//GET

//1. Read a specific orrder
router.get("/:id", orderController.getOrderById);

//2. Read orders
router.get("/", orderController.getOrders);

//POST

//3. Create a new order
router.post("/", orderController.createOrder);

//PUT

//4. Update an existing order
router.put("/:id", orderController.updateOrder);

//DELETE

//5. Delete an existing order
router.delete("/:id", orderController.deleteOrder);

module.exports = router;