//This helper shall update stock availability when a new order is created

//Import the model
const Product = require ('../models/Products');

const updateProductStock = async (products = []) => {
    for (let p of products) {
        const product = await Product.findById(p.product);

        //Validate product
        if(!product) {
            const err = new Error (`Product ${p.product}, not found`)
            err.status = 404;
            err.type = "business";
            throw err;
        }

        //Stock non sufficient
        if(product.quantity <p.orderedQuantity) {
            const err = new Error (
                `There is no stock availability for ${product.name}`
            );
            err.status = 409;
            err.type ="business";
            throw err;
        }

        //Update quantities
        await Product.findByIdAndUpdate(
            p.product,
            //Inc = increment from MongoDB, it removes the ordered quantity from total quantity for a specific product.
            {$inc: {quantity: -p.orderedQuantity}}
        );
    }
};

module.exports = {updateProductStock};