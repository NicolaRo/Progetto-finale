//Import mongoose to handle DB
const mongoose = require ("mongoose");

const OrderSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    products: [
        {
            product: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
            orderedQuantity: {type: Number, required: true},
            price: {type: Number, required: true},
            producerId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
            containerType: {type: String},
            containerQuantity: {type: Number, default: 0}
        }
    ],
    containers: [{type: mongoose.Schema.Types.ObjectId, ref: "Container"}],
    status: {
        type: String,
        enum: ["Order created", "Preparing order", "Order shipped", "Order closed"],
        default: "Order created"
    },
    //Stripe payment intent ID - Is required to refund the cuational deposit (taken to grant containers return)
    stripePaymentIntentId: {
        type: String,
    },
    //Container deposit amount - displayed as separated amount in each order.
    depositAmount: {
        type: Number,
        default: 5
    },
    //redund status with default value set on "held"
    depositStatus: {
        type: String,
        enum: ["held", "refunded"],
        default: "held"
    },
}, {timestamps: true});

const Orders = mongoose.model("Orders", OrderSchema);

module.exports = Orders