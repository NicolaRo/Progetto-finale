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
            if(!p.product || !p.orderedQuantity || p.orderedQuantity <= 0) {
                return res.status(400).json({message: "Every product must have a valid ID and positive quantity"});
            }
        }

        // 1.2. Validete Users
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({message: "User not found"});

        //1.3. Update product stock availability
        await updateProductStock(products);

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
        .populate("products.product");

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
        
        //console.log for debug
        console.log(req.body);

        const orderId = req.params.id;
        const {products: newProducts, status, userId, containers} = req.body;

        //Validate order exists
        const order = await Order.findById(orderId);

        //console.log for debug
        console.log("order.status dal DB:", JSON.stringify(order.status));
        
        if(!order)
            return res.status(404).json({message: "Order not found"});

        // 3.1. Validete Users
        if(userId){
            const user = await User.findById(userId);
        if (!user) 
            return res.status(404).json({message: "User not found"});
        order.user = user._id;
        }
        

        if (newProducts && newProducts.length > 0) {
            await updateProductStock(newProducts);
    
            order.products.push(...newProducts);
        }

        if(status) {
            const allowedStatuses = ["Order created", "Preparing order", "Order shipped"];
            
            if(!allowedStatuses.includes(status)) {
                const err = new Error("Invalid Order status");
                err.status = 422 //Unprocessable Entity
                throw err;
            }
            
            //To know which is the current status
            const currentIndex = allowedStatuses.indexOf(order.status);

            //To set a new status to migrate to
            const newIndex = allowedStatuses.indexOf(status);

            //validate order status if already updated don't touch it
            if(newIndex === currentIndex) 
                return res.status(200).json(order);

            //console.log for debug
            console.log("currentIndex:", currentIndex, "newIndex:", newIndex);

            if(newIndex !== currentIndex + 1) {
                return res.status(400).json({message: "Invalid status transition: orders must advance one step at a time"})
            }
            order.status = status;
        }

        if(containers && containers.length > 0) {
            //Console.log for debug
            console.log("containers ricevuti:", containers);
            
            const assignedContanierIds = [];

            for (const selection of containers) {
                //console.log for debug
                console.log("Cerco:", selection.type, "Container ready to use");
    
                
                //get the available containers per each requested type
                const available = await Container.find({
                
                    type: selection.type,
                    status: "Container ready to use"
                }).limit(Number(selection.quantity));

                 //Console.log for debug
                 console.log("container trovati:", available);

                //Update container's status to "Container Busy"
                for(const container of available) {
                    container.status = "Container busy";
                    await container.save();
                    assignedContanierIds.push(container._id);
                }
            }
            order.containers = assignedContanierIds;
        }



        await order.save();
        return res.status(200).json(order);
    } catch (error) {
        console.error(error);
        return res.status(error.status || 500).json({message: error.message});
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
