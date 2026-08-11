import express from "express";
const router = express.Router();

import * as ingredientController from "../controllers/ingredientController";

// GET
router.get("/", ingredientController.searchIngredients);

export default router;
module.exports = router;