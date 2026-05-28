//CRUD

//Import the models as an order includes products, users an containers
const Order = require ('../models/Orders');
const Product = require ('../models/Products');
const User = require ('../models/Users');
const Container = require ('../models/Containers');

//Import the StockHelper function
const {updateProductStock, restoreProductStock} = require ('../utils/stockHelper');

//1. Create an order
const createOrder = async (req, res) => {
    try {
        //console.log for debug
        console.log(req.body);
        const {products} = req.body;

        //console.log for debug
        console.log("products:", products);

        //1.1. Validate conditions under which we can accept a new order creation
        if(!Array.isArray(products) || products.length === 0){
            return res.status(400).json({message:"Order details missing or not valid"});
        }

        for (let p of products) {

            //Console log for debug
            console.log("validating:", p.product, p.orderedQuantity);

            if(!p.product || !p.orderedQuantity || p.orderedQuantity <= 0) {
                return res.status(400).json({message: "Every product must have a valid ID and positive quantity"});
            }

            //Validating orderable quantity (it must be smaller or equal to availability)
            const productInDb = await Product.findById(p.product);
            if(!productInDb) {
                return res.status(404).json({message: `Product ${p.product} not found`});
            }
            if (Number(p.orderedQuantity)> productInDb.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${productInDb.name}.Availabile:  ${productInDb.quantity}`
                });
            }
        }

        // 1.2. Validete Users
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({message: "User not found"});

        //1.3. Update product stock availability
        await updateProductStock(products);

        //Console.log for debug
        console.log("Sto per creare l'ordine...");

        //1.4. Create order
        const [order] = await Order.create (
            [
                {
                    user: user._id,
                    products,
                    status: "Order created",
                    containers: []
                }
            ]
        ); return res.status(201).json(order);

    } catch (error) {
        console.error(error);
        return res.status(500).json({message: error.message});
        
    }
};

//2.1 Read orders
const getOrders = async (req, res) => {
    try {

        //Console log for debug
        console.log("getOrders chiamato, user:", req.user);


        //2.1.1. Dynamic filter
        const filter = {};

        //2.1.2
        if (req.query.date) {
            const start = new Date(req.query.date);
            start.setHours(0,0,0,0);

            const end = new Date(req.query.date);
            end.setHours(23,59,59,999);

            filter.createdAt =  {$gte: start, $lte: end};
        }
        //2.1.3. Filter orders belonging to a logged user
        if (req.query.userId) {
            filter.user = req.query.userId; 
        }

        //2.1.4. Filter products per Producer - show only orders with their products
        if (req.user.role === "Producer") {
            filter["products.producerId"] = req.user._id;
        }

        //2.1.5. Final query
        const orders = await Order.find(filter)
        .populate("user")
        .populate("products.product")
        .populate("products.producerId")
        .populate("containers");

        if(req.user.role === "Producer") {
            const filteredOrders = orders.map(order =>  {
                const obj = order.toObject();

                obj.products = obj.products.filter(p =>
                    p.producerId && 
                    p.producerId._id.toString() === req.user._id.toString()
                 );

                 return obj;
            });
            return res.status(200).json(filteredOrders);
        }
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

//2.2 Read one specific order
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        .populate("user")
        .populate("products.product");
        if(!order)
            return res.status(404).json({message: "Order not found"});
        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

//3. Update an order
const updateOrder = async (req, res) => {
    try {

        //console log for debug
        console.log("updateOrder chiamato");
        console.log("req.body.status:", req.body.status);
        console.log("req.body:", req.body);
        
        const orderId = req.params.id;

        const {
            products: newProducts,
            userId,
            containers
        } = req.body;

        console.log(req.body);

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
            order.products.push(...newProducts);
        }

        // =========================
        // CONTAINERS ASSIGNMENT
        // =========================
        if (containers && containers.length > 0) {

            console.log("containers ricevuti:", containers);

            const assignedContainerIds = [];

            for (const selection of containers) {

                console.log("Cerco:", selection.type, "Container ready to use");

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
            order.containers.push(...assignedContainerIds);

            // =========================
            // ORDER STATUS CALCULATION
            // =========================
            const packedCount = order.products.filter(
                p => p.containerType && p.containerQuantity > 0
            ).length;

            console.log(`packedProducts: ${packedCount} / ${order.products.length}`);

            if (packedCount === order.products.length && order.products.length > 0) {
                order.status = "Order shipped";
            } else if (packedCount > 0) {
                order.status = "Preparing order";
            } else {
                order.status = "Order created";
            }

            console.log("NEW ORDER STATUS:", order.status);
            console.log("containers dopo push:", order.containers);
        }

        // =========================
        // ORDER COMPLETION (Producer checkin)
        // =========================
        if (req.body.status === "Order closed") {

            //Console log for debug
            console.log("Order closed triggered");
            console.log("stripePaymentIntentId:", order.stripePaymentIntentId);
            console.log("depositStatus:", order.depositStatus);
            console.log("depositAmount:", order.depositAmount);

            //Update all the containers from the order as "Container ready to use"
            for (const containerId of order.containers) {
            await Container.findByIdAndUpdate(containerId, { status: "Container ready to use" });
            }

            //if a deposit to refund exist, then do the refund
            if(order.stripePaymentIntentId && order.depositStatus === "held") {
                try{
                    const stripe = require ('stripe')(process.env.STRIPE_SECRET_KEY);

                    // get the session to read the actual payment_intent
                    const session = await stripe.checkout.sessions.retrieve(order.stripePaymentIntentId);

                    //console.log for debug
                    console.log("payment_intent from the session:", session.stripePaymentIntent);
                    console.log("session completa:", JSON.stringify(session, null, 2));

                    await stripe.refunds.create({
                        payment_intent: session.payment_intent,
                        amount: order.depositAmount *100,
                    });

                    //Update the refund status
                    order.depositStatus = "refunded";

                    //Console.log for debug
                    console.log(`${order.depositAmount} Deposit for the order:${order._id} has been refunded`);
                
                } catch (stripeError) {
                    //log the error without preventing the order closure
                    console.error("Stripe refund error:", stripeError.message);
                }
            }
            order.status = "Order closed";
        }

        await order.save();

        return res.status(200).json(order);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: error.message
        });
    }
};

//4. Deleta an order
const deleteOrder = async (req, res) => {
    
    try {
        //Console.log for debug
        console.log(req.user)
        const order = await Order.findById(req.params.id);
        if(!order)
            return res.status(404).json({message: "Order not found"});
        await restoreProductStock(order.products);
        await Order.findByIdAndDelete(req.params.id);
        return res.status(204).json({message: "Order successfully deleted"});

    } catch (error) {
        return res.status(500).json ({message: error.message});
    }
    
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
};
