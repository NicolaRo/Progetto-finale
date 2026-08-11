//This helper shall update stock availability when a new order is created
import Product from '../models/Products';

//Product structure as it arrives from the order:
interface OrderedProduct {
    product: string;
    orderedQuantity: number;
}

//Custom Error with status and type
interface AppError extends Error {
    status?: number;
    type?: string;
}

//Update stock availability when a new order is created
const updateProductStock = async (products: OrderedProduct[] = []): Promise<void> => {
    for (let p of products) {
        const product = await Product.findById(p.product);

        //Validate product
        if(!product) {
            const err: AppError = new Error(`Product ${p.product}, not found`);
            err.status = 404;
            err.type = "business";
            throw err;
        }

        //Stock non sufficient
        if(product.quantity < p.orderedQuantity) {
            const err: AppError = new Error(
                `There is no stock availability for ${product.name}`
            );
            err.status = 409;
            err.type = "business";
            throw err;
        }

        //Update quantities
        await Product.findByIdAndUpdate(
            p.product,
            {$inc: {quantity: -p.orderedQuantity}}
        );
    }
};

//Restore stock availability when an existing order is canceled before shipping
const restoreProductStock = async (products: OrderedProduct[] = []): Promise<void> => {
    for (let p of products) {
        const product = await Product.findById(p.product);

        //Validate product
        if(!product) {
            const err: AppError = new Error(`Product ${p.product}, not found`);
            err.status = 404;
            err.type = "business";
            throw err;
        }

        await Product.findByIdAndUpdate(
            p.product,
            {$inc: {quantity: +p.orderedQuantity}}
        );
    }
};

module.exports = {updateProductStock, restoreProductStock};