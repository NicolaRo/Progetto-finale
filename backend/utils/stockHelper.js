//This helper shall update stock availability when a new order is created

//Import the model
const Product = require ('../models/Products');

//Update stock availabibilty when a new order is created
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
            //Inc = increment from MongoDB, it removes the ordered quantity from the stock for a specific product.
            {$inc: {quantity: -p.orderedQuantity}}
        );
    }
};


//Restore stock availability when an existing order is canceled before shipping
const restoreProductStock = async (products = []) => {
    for (let p of products) {
        const product = await Product.findById(p.product); 

        await Product.findByIdAndUpdate(
            p.product,
            {$inc: {quantity: +p.orderedQuantity} }
        )
    };
}

module.exports = {updateProductStock, restoreProductStock};