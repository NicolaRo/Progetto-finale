//Importo mongoose per la gestione dei dati sul DB
const mongoose = require ("mongoose");

//Creo lo schema di dati chiamato ProductSchema per la registrazione delle info di prodotto
const ProductSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Campo obbligatorio."],
        trim: true,
        minlength: [2, "Il nome prodotto deve contenere almeno 2 caratteri."]
    },
    description: {
        type: String,
        required: [true, "Inserire una descrizione prodotto."],
        maxlength: [200, "Limite massimo di caratteri raggiunto."]
    },
    price:{
        type: Number,
        required: [true, "Indicare un prezzo maggiore di 0."],
        min: [0, "Il prezzo minimo non può essere negativo."]
    },
    type:{
        type: String,
        enum: ["Verdura","Frutta","Secco","Surgelato","Liquido."],
        required: [true, "Definire il tipo di prodotto."]
    },
    quantity:{
        type: Number,
        required: true,
        min: [0, "La quantità minima non può essere negativa."]
    },
    producerId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},

}, {timestamps: true});

const Product = mongoose.model("Product", ProductSchema);