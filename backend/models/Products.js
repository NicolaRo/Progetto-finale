//Importo mongoose per la gestione dei dati sul DB
const mongoose = require ("mongoose");

//Creo lo schema di dati chiamato ProductSchema per la registrazione delle info di prodotto
const ProductSchema = new mongoose.schema({
    name:{
        type: String,
        required: [true, 'Campo obbligatorio'],
        trim: true,
        minlenght: [2, 'Il nome prodotto deve contenere almeno 2 caratteri']
    },
    description: {
        type: String,
        required: [true, 'Inserire una descrizione prodotto'],
        /* Qua ci vuole una maxlenght, come la scrivo? */
    },
    price:{
        type: Number,
        trim: true,
        min: [0, "Il prezzo minimo non può essere negativo"]
    },
    type:{
        type: String,
        enum: ["Vegetable","Fruit","Dry","Frozen","Liquid"],
        required: [true, "Definire il tipo di prodotto"]
    },
    quantity:{
        type: Number,
        required: true,
        min: [0, "La quantità minima non può essere negativa"]
    },

}, {timestamps: true});

const Product = mongoose.model("Product", ProductSchema);