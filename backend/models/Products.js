//Import mongoose to handle DB
const mongoose = require ("mongoose");

// Creating a data schema called ProductSchema to store product information in the DB
const ProductSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Required field"],
        trim: true,
        minlength: [2, "Product name must be at least 2 characters long"]
    },
    description: {
        type: String,
        required: [true, "Provide a short product description"],
        maxlength: [200, "Characters limit reached"]
    },
    price:{
        type: Number,
        required: [true, "Price value must be higher than 0"],
        min: [0, "Price can not be lower than 0"]
    },
    type:{
        type: String,
        enum: ["Vegetables","Fruits","Dry","Frozen","Liquid"],
        required: [true, "Define a product cathegory"]
    },
    quantity:{
        type: Number,
        required: true,
        min: [0, "Quantity must be higher than 0"]
    },
    unit: {
        type: String,
        enum: ["Kg", "Cl", "Unit"],
        required: true,
    },
    image: {
        type: String,
    },
    ingredientId:{
        type: String
    },
    producerId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},

}, {timestamps: true});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product