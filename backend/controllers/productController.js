//CRUD 

//Import the model
const Product = require ('../models/Products');

//1. Create Product from user query
const createProduct = async (req, res) => {
    try {

        const {name, description, price, type, quantity, unit,} = req.body;

        if(!name || !description || !price || !type || !quantity || !unit) {
            return res.status(400).json ({message: "Product details are missing"});
        } 
        const product = await Product.create({
            name,
            description,
            price,
            type,
            quantity,
            unit,
            producerId: req.user.id
        });
        return res.status(201).json(product);
    } catch (error) {
        console.error('Product create Error:', error);
        return res.status(500).json({message: error.message});       
    }
}

//2.1. Read Products information
const getProducts = async (req, res) => {
    try {
        //Get all the Products available
        const products = await Product.find();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json ({message: error.message});
    }
};

//2.2. Read one specific product
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById (req.params.id);
        if(!product) {
            return res.status(404).json({message: "Product not found"});
        }
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json ({message: error.message});
    }
};

//3. Update a product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate (
            req.params.id,
            req.body,
            {new: true}
        );
        if(!product)
            return res.status(404).json({message: "Product not found"});
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

//4. Delete a product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete (req.params.id);

        if(!product)
            return res.status(404).json({message: "Product not found"});
        return res.status(200).json({message: "Product deleted successfully"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};