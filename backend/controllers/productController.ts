import { Request, Response } from "express";
import Product from "../models/Products";
import { JwtPayload } from "jsonwebtoken";

// CRUD

interface ProductInput {
    name?: string;
    description?: string;
    price?: number;
    type?: "Vegetables" | "Fruits" | "Dry" | "Frozen" | "Liquid";
    quantity?: number;
    unit?: "Kg" | "Lt" | "Cl" | "Gr" | "Piece";
    image?: string;
    ingredientId?: string;
}

// Forma della query dinamica usata in getProducts
interface ProductQuery {
    name?: { $regex: string; $options: string };
    type?: { $in: ("Vegetables" | "Fruits" | "Dry" | "Frozen" | "Liquid")[] };
    producerId?: string;
    quantity?: { $gt: number };
}

// Estrae l'id utente in modo sicuro dal payload del token (string | JwtPayload)
const getUserId = (user: Request["user"]): string | undefined => {
    if (!user || typeof user === "string") return undefined;
    return (user as JwtPayload)._id;
};

const getUserRole = (user: Request["user"]): string | undefined => {
    if (!user || typeof user === "string") return undefined;
    return (user as JwtPayload).role;
};

// 1. Create Product from user query
const createProduct = async (req: Request<{}, {}, ProductInput>, res: Response) => {
    try {

        const { name, description, price, type, quantity, unit, image, ingredientId } = req.body;

        if (!name || !description || !price || !type || !quantity || !unit) {
            return res.status(400).json({ message: "Product details are missing" });
        }
        const product = await Product.create({
            name,
            description,
            price,
            type,
            quantity,
            unit,
            producerId: getUserId(req.user),
            image,
            ingredientId
        });
        return res.status(201).json(product);
    } catch (error) {
        console.error('Product create Error:', error);
        return res.status(500).json({ message: (error as Error).message });
    }
}

// 2.1. Read Products information
const getProducts = async (req: Request, res: Response) => {
    try {
        const name = req.query.name as string | undefined;
        const type = req.query.type as string | string[] | undefined;
        const producerId = req.query.producerId as string | undefined;

        const query: ProductQuery = {};
        if (name) query.name = { $regex: name, $options: "i" };
        if (type) query.type = { $in: ([] as ("Vegetables" | "Fruits" | "Dry" | "Frozen" | "Liquid")[]).concat(type as any) };
        if (producerId) query.producerId = producerId;
        if (getUserRole(req.user) === "User") query.quantity = { $gt: 0 }; // Hide qty: 0 to Users

        const products = await Product.find(query).populate("producerId", "name");
        res.set('Cache-control', 'no-store');
        return res.status(200).json(products);
    } catch (error) {

        return res.status(500).json({ message: (error as Error).message });
    }
};

// 2.2. Get Producer's Product list
const getProducersProducts = async (req: Request, res: Response) => {
    try {
        // Get all the Products available
        const products = await Product.find({ producerId: getUserId(req.user) });
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
};

// 2.2. Read one specific product
const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
};

// 3. Update a product
const updateProduct = async (req: Request<{ id: string }, {}, ProductInput>, res: Response) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
};

// 4. Delete a product
const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product)
            return res.status(404).json({ message: "Product not found" });
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
};

export {
    createProduct,
    getProducts,
    getProductById,
    getProducersProducts,
    updateProduct,
    deleteProduct
};
module.exports = {
    createProduct,
    getProducts,
    getProductById,
    getProducersProducts,
    updateProduct,
    deleteProduct
};