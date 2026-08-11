import express from "express";
const router = express.Router();

import * as containerController from "../controllers/containerController";
import authMiddleware from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";

// GET

// 1. Read a specific container
router.get("/:id", authMiddleware, containerController.getContainerById);

// 2. Read containers
router.get("/", authMiddleware, containerController.getContainers);

// POST

// 3. Create a container
// ONLY the "Producer" can create a container
router.post("/", authMiddleware, roleMiddleware("Producer"), containerController.createContainer);

// PUT

// 4. Update an existing container
router.put("/:id", authMiddleware, containerController.updateContainer);

// DELETE

// 5. Delete an existing container
// ONLY the "Producer" can create a container
router.delete("/:id", authMiddleware, roleMiddleware("Producer"), containerController.deleteContainer);

export default router;
module.exports = router;