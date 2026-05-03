//Function to gather product's pictures from spoonacular
async function getIngredients (query) {
    
    //Define baseUrl
    const baseUrl = "https://api.spoonacular.com";

    const fullUrl = `${baseUrl}/food/ingredients/search?apiKey=${process.env.SPOONACULAR_API_KEY}&query=${query}&number=10`;
    try {
        const response = await fetch(fullUrl);
        const data = await response.json();
        return data.results;
    } catch (error) {
        throw error;
    }
};

module.exports = {getIngredients};