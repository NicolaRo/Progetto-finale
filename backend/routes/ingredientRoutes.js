//Import express and router
const express = require ("express");
const router = express.Router();

//Import controller
const ingredientController = require ('../controllers/ingredientController');

//GET 
router.get("/", ingredientController.searchIngredients);

module.exports = router;