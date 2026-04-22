//Import express and router
const express = require ("express");
const router = express.Router();

//Import controller
const containerController = require ('../controllers/containerController');

//GET

//1. Read a specific container
router.get("/:id", containerController.getContainerById);

//2. Read containers
router.get("/", containerController.getContainers);

//POST

//3. Create a container
router.post("/", containerController.createContainer);

//PUT

//4. Update an existing container
router.put("/:id", containerController.updateContainer);

//DELETE

//5. Delete an existing container
router.delete("/:id", containerController.deleteContainer);

module.exports = router;