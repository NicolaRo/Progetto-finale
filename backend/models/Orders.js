//Import mongoose to handle DB
const mongoose = require ("mongoose");

const OrderSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    products: [
        {
            product: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
            orderedQuantity: {type: Number, required: true},
            price: {type: Number, required: true},
            producerId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
        }
    ],
    containers: [{type: mongoose.Schema.Types.ObjectId, ref: "Container"}],
    state: {
        type: String,
        enum: ["Order created", "Order received", "Preparing Order", "Order shipped"],
        default: "Ordine creato"
    }
}, {timestamps: true});

const Orders = mongoose.model("Orders", OrderSchema);

module.exports = Orders