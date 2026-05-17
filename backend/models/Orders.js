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
    }
}, {timestamps: true});

const Orders = mongoose.model("Orders", OrderSchema);

module.exports = Orders