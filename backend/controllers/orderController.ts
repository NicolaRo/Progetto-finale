import { Request, Response } from "express";
import Order from "../models/Orders";
import Product from "../models/Products";
import User from "../models/Users";
import Container from "../models/Containers";
import { JwtPayload } from "jsonwebtoken";

const { updateProductStock, restoreProductStock } = require("../utils/stockHelper");

// CRUD

interface OrderProductInput {
    product: string;
    orderedQuantity: number;
    price?: number;
    producerId?: string;
    containerType?: string;
    containerQuantity?: number;
}

interface ContainerSelection {
    type: "Sealed" | "Non-Sealed" | "Freezer-Container";
    quantity: number;
    productId: string;
}

interface OrderUpdateInput {
    products?: OrderProductInput[];
    userId?: string;
    containers?: ContainerSelection[];
    status?: string;
}

interface OrderFilter {
    createdAt?: { $gte: Date; $lte: Date };
    user?: string;
    "products.producerId"?: string;
}

const getUserId = (user: Request["user"]): string | undefined => {
    if (!user || typeof user === "string") return undefined;
    return (user as JwtPayload)._id;
};

const getUserRole = (user: Request["user"]): string | undefined => {
    if (!user || typeof user === "string") return undefined;
    return (user as JwtPayload).role;
};

// 1. Create an order
const createOrder = async (req: Request<{}, {}, { products: OrderProductInput[] }>, res: Response) => {
    try {
        const { products } = req.body;

        // 1.1. Validate conditions under which we can accept a new order creation
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Order details missing or not valid" });
        }

        for (let p of products) {

            if (!p.product || !p.orderedQuantity || p.orderedQuantity <= 0) {
                return res.status(400).json({ message: "Every product must have a valid ID and positive quantity" });
            }

            // Validating orderable quantity (it must be smaller or equal to availability)
            const productInDb = await Product.findById(p.product);
            if (!productInDb) {
                return res.status(404).json({ message: `Product ${p.product} not found` });
            }
            if (Number(p.orderedQuantity) > productInDb.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${productInDb.name}.Availabile:  ${productInDb.quantity}`
                });
            }
        }

        // 1.2. Validete Users
        const user = await User.findById(getUserId(req.user));
        if (!user) return res.status(404).json({ message: "User not found" });

        // 1.3. Update product stock availability
        await updateProductStock(products);

        // 1.4. Create order
        const created = await Order.create([
            {
                user: user._id,
                products,
                status: "Order created",
                containers: []
            }
        ] as any);
        const order = created[0];
        return res.status(201).json(order);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: (error as Error).message });
    }
};

// 2.1 Read orders
const getOrders = async (req: Request, res: Response) => {
    try {

        // 2.1.1. Dynamic filter
        const filter: OrderFilter = {};

        // 2.1.2
        if (req.query.date) {
            const start = new Date(req.query.date as string);
            start.setHours(0, 0, 0, 0);

            const end = new Date(req.query.date as string);
            end.setHours(23, 59, 59, 999);

            filter.createdAt = { $gte: start, $lte: end };
        }
        // 2.1.3. Filter orders belonging to a logged user
        if (req.query.userId) {
            filter.user = req.query.userId as string;
        }

        const userId = getUserId(req.user);
        const userRole = getUserRole(req.user);

        // 2.1.4a. Filter products per Producer - show only orders with their products
        if (userRole === "Producer") {
            filter["products.producerId"] = userId;
        }
        // 2.1.4b. Filter order per User - show only orders with their products
        if (userRole === "User") {
            filter.user = userId;
        }

        // 2.1.5. Final query
        const orders = await Order.find(filter)
            .populate("user")
            .populate("products.product")
            .populate("products.producerId")
            .populate("containers");

        if (userRole === "Producer") {
            const filteredOrders = orders.map(order => {
                const obj: any = order.toObject();

                obj.products = obj.products.filter((p: any) =>
                    p.producerId &&
                    p.producerId._id.toString() === userId
                );

                return obj;
            });
            return res.status(200).json(filteredOrders);
        }
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
};

// 2.2 Read one specific order
const getOrderById = async (req: Request, res: Response) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user")
            .populate("products.product");
        if (!order)
            return res.status(404).json({ message: "Order not found" });
        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
};

// 3. Update an order
const updateOrder = async (req: Request<{ id: string }, {}, OrderUpdateInput>, res: Response) => {
    try {
        const orderId = req.params.id;

        const {
            products: newProducts,
            userId,
            containers
        } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // =========================
        // USER UPDATE (optional)
        // =========================
        if (userId) {
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            order.user = user._id;
        }

        // =========================
        // PRODUCTS ADD (optional)
        // =========================
        if (newProducts && newProducts.length > 0) {
            await updateProductStock(newProducts);
            order.products.push(...(newProducts as any));
        }

        // =========================
        // CONTAINERS ASSIGNMENT
        // =========================
        if (containers && containers.length > 0) {

            const assignedContainerIds = [];

            for (const selection of containers) {

                const available = await Container.find({
                    type: selection.type,
                    status: "Container ready to use"
                }).limit(Number(selection.quantity));

                if (available.length === 0) {
                    return res.status(400).json({
                        message: `No containers available of type ${selection.type}`
                    });
                }

                const targetProduct = order.products.find(
                    p => p.product.toString() === selection.productId
                );

                if (!targetProduct) {
                    return res.status(404).json({
                        message: "Product not found in order"
                    });
                }

                // attach container info to product
                targetProduct.containerType = selection.type;
                targetProduct.containerQuantity = Number(selection.quantity);

                // mark containers as busy
                for (const container of available) {
                    container.status = "Container busy";
                    await container.save();
                    assignedContainerIds.push(container._id);
                }
            }

            order.markModified("products");

            // attach containers to order
            order.containers.push(...(assignedContainerIds as any));

            // =========================
            // ORDER STATUS CALCULATION
            // =========================
            const packedCount = order.products.filter(
                p => p.containerType && (p.containerQuantity ?? 0) > 0
            ).length;

            if (packedCount === order.products.length && order.products.length > 0) {
                order.status = "Order shipped";
            } else if (packedCount > 0) {
                order.status = "Preparing order";
            } else {
                order.status = "Order created";
            }
        }

        // =========================
        // ORDER COMPLETION (Producer checkin)
        // =========================
        if (req.body.status === "Order closed") {

            // Update all the containers from the order as "Container ready to use"
            for (const containerId of order.containers) {
                await Container.findByIdAndUpdate(containerId, { status: "Container ready to use" });
            }

            // if a deposit to refund exist, then do the refund
            if (order.stripePaymentIntentId && order.depositStatus === "held") {
                try {
                    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

                    // get the session to read the actual payment_intent
                    const session = await stripe.checkout.sessions.retrieve(order.stripePaymentIntentId);

                    await stripe.refunds.create({
                        payment_intent: session.payment_intent,
                        amount: order.depositAmount * 100,
                    });

                    // Update the refund status
                    order.depositStatus = "refunded";

                } catch (stripeError) {
                    // log the error without preventing the order closure
                    console.error("Stripe refund error:", (stripeError as Error).message);
                }
            }
            order.status = "Order closed" as any;
        }

        await order.save();

        return res.status(200).json(order);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: (error as Error).message
        });
    }
};

// 4. Deleta an order
const deleteOrder = async (req: Request, res: Response) => {

    try {
        const order = await Order.findById(req.params.id);
        if (!order)
            return res.status(404).json({ message: "Order not found" });
        await restoreProductStock(order.products as any);
        await Order.findByIdAndDelete(req.params.id);
        // 204 No Content non deve avere body per specifica HTTP
        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }

};

export {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
};
module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
};