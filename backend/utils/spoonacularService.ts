//Function to gather product's pictures from spoonacular
interface SpoonacularIngredient {
    id: number;
    name: string;
    image: string;
}

interface SpoonacularSearchResponse {
    results: SpoonacularIngredient [];
}

async function getIngredients (query: string): Promise<SpoonacularIngredient[]> {
    //Define baseUrl
    const baseUrl = "https://api.spoonacular.com";
    const fullUrl = `${baseUrl}/food/ingredients/search?apiKey=${process.env.SPOONACULAR_API_KEY}&query=${query}&number=10`;

    const response = await fetch(fullUrl);

    if(!response.ok) {
        throw new Error(`Spoonacular request failed with status ${response.status}`);
    }

    const data: SpoonacularSearchResponse = await response.json();
    return data.results;
}
    
module.exports = {getIngredients};