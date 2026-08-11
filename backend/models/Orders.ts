import mongoose, {Document, Schema} from "mongoose";

//Product's data format within an order's array
interface IOrderProduct {
    product: mongoose.Types.ObjectId;
    orderedQuantity: number;
    price: number;
    producerId: mongoose.Types.ObjectId;
    containerType?: string;
    containerQuantity?: number;
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    products: IOrderProduct[];
    containers: mongoose.Types.ObjectId[];
    status: "Order created" | "Preparing order" | "Order shipped" | "Order closed";
    stripePaymentIntentId?: string; // Stripe payment intent ID - Is required to refund the deposit (taken to grant containers return)
    depositAmount: number;
    depositStatus: "held" | "refunded"; // refund status with default value set on "held"
}

const OrderSchema = new Schema<IOrder>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", reuired: true},
    products: [
        {
            product: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
            orderedQuantity: {type: Number, required: true},
            price: {type: Number, required: true},
            producerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", requred: true},
            containerType: {type: String},
            containerQuantity: { type: Number, default: 0}
        }
    ],
    containers: [{type: mongoose.Schema.Types.ObjectId, ref: "Container"}],
    status:{
        type: String,
        enum: ["Order created", "Preparing order", "Order shipped", "Order closed"],
        default: "Order created"
    },
    stripePaymentIntentId :{
        type: String,
    },
    depositAmount: {
        type: Number,
        default: 5
    },
    depositStatus: {
        type:String,
        enum: ["held", "refunded"],
        default: "held"
    },
}, {timestamps: true});

const Orders = mongoose.model<IOrder>("Orders", OrderSchema);

export default Orders;
module.exports = Orders;