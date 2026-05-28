//Contoller to handle payments with stripes and get orders closed.
const stripe = require ('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require ('../models/Orders');

const createCheckoutSession = async (req, res) => {
    try{
        
        const {orderId} = req.body;

        //Get the order form the DB populated with data
        const order = await Order.findById(orderId).populate("products.product");
        
        //Create lines for products of each order
        const productLineItems = order.products.map((p) => ({
            price_data: {
                currency: 'eur',
                product_data:{
                    name:p.product.name,
                },
                unit_amount: Math.round(p.price *100), //Stripe operates in cents
            },
            quantity: p.orderedQuantity,
        }));

        //Add the caution deposit as a separated line
        //It gets refundable when the User return the containers
        const depositLineItem ={
            price_data:{
                currency: 'eur',
                product_data:{
                    name:'Container deposit',
                    description: 'This amount is temporary frozen from your card. We will refunded it when all the containers are returned'
                },
                unit_amount: 500,  //equals to 5€
            },
            quantity: 1,
        };

        //Create the checkout session including products + deposit
        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            line_items: [...productLineItems, depositLineItem],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
         });

        //Get the payment intent from the session and save it into the order
        //Will use it later to do the deposit refund
        await Order.findByIdAndUpdate(orderId, {
            stripePaymentIntentId: session.payment_intent,
            depositAmount: 5,
            depositStatus: 'held',
        });

        return res.status(200).json({url: session.url});

    } catch (error) {
        console.error("Stripe error:", error);
        return res.status(500).json({message: error.message});
    }
};

module.exports = {createCheckoutSession};