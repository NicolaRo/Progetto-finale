//Contoller to handle payments with stripes and get orders closed.
const stripe = require ('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require ('../models/Orders');

const createCheckoutSession = async (req, res) => {
    try{

        
        
        const {orderId} = req.body;
        const order = await Order.findById(orderId).populate("products.product");

        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            line_items: order.products.map((p)=> ({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: p.product.name,
                    },
                    unit_amount: Math.round(p.price*100) //Stripe requires cents
                },
                quantity: p.orderedQuantity,
            })),
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });

        return res.status(200).json({url: session.url});

    } catch (error) {
        console.error("Stripe error:", error);
        return res.status(500).json({message: error.message});
    }
};

module.exports = {createCheckoutSession};