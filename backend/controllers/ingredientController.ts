import { Request, Response } from "express";
const { getIngredients } = require("../utils/spoonacularService");

// Controller to gather the product's images (spoonacular) from the producer's query
// 1. Get
const searchIngredients = async (req: Request, res: Response) => {

    try {
        // get the query
        const producerQuery = req.query.query as string;

        const results = await getIngredients(producerQuery);
        return res.json(results);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
};

export { searchIngredients };
module.exports = { searchIngredients };