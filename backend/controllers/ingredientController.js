const {getIngredients} = require ('../utils/spoonacularService');

//Controller to gather the product's images (spoonacular) from the producer's query
//1. Get 
const searchIngredients = async (req, res) => {
    console.log('query ricevuta:', req.query);
    try {
        //get the query
        const producerQuery = await (req.query.query);

        const results = await getIngredients(producerQuery);
        res.json(results);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

module.exports = {searchIngredients};