import express from "express";
const router = express.Router();

import * as orderController from "../controllers/orderController";
import authMiddleware from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";

// GET

// 1. Read a specific orrder
router.get("/:id", authMiddleware, orderController.getOrderById);

// 2. Read orders
router.get("/", authMiddleware, orderController.getOrders);

// POST

// 3. Create a new order
// ONLY the "User" can create a new order
router.post("/", authMiddleware, roleMiddleware("User"), orderController.createOrder);

// PUT

// 4. Update an existing order
// ONLY the "Producer" can update an existing order
router.put("/:id", authMiddleware, roleMiddleware("Producer"), orderController.updateOrder);

// DELETE

// 5. Delete an existing order
// ONLY the "User" can delete an existing order
router.delete("/:id", authMiddleware, roleMiddleware("User"), orderController.deleteOrder);

export default router;
module.exports = router;