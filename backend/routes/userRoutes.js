//Import express and router
const express = require ("express");
const router = express.Router();

//Import controller
const userController = require ('../controllers/userController');

//GET

//1. Read a specific user
router.get("/:id", userController.getUserById);

//2. Read users
router.get("/", userController.getUsers);

//POST

//3. Create a new user
router.post("/register", userController.createUser);

//3.1 Log in an existing user
router.post("/login", userController.loginUser);

//PUT

//4. Update an existing user
router.put("/:id", userController.updateUser);

//DELETE

//5. Delete an existing user
router.delete("/:id", userController.deleteUser);

module.exports = router; 