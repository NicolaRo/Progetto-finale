import express from "express";
const router = express.Router();

import * as userController from "../controllers/userController";

// GET

// 1. Read a specific user
router.get("/:id", userController.getUserById);

// 2. Read users
router.get("/", userController.getUsers);

// POST

// 3. Create a new user
router.post("/register", userController.createUser);

// 3.1 Log in an existing user
router.post("/login", userController.loginUser);

// 3.1.1 Log in an existing user with Google Auth
router.post("/google-login", userController.googleLogin);

// 3.1.2 Check for already existing email
router.post("/check-email", userController.checkEmail);

// PUT

// 4. Update an existing user
router.put("/:id", userController.updateUser);

// DELETE

// 5. Delete an existing user
router.delete("/:id", userController.deleteUser);

export default router;
module.exports = router;