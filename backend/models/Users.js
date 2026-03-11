//Importo mongoose per la gestione dei dati sul DB
const mongoose = require ("mongoose");

//Creo lo schema di dati chiamato UserSchema per la registrazione delle info dell'utente
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Campo obbligatorio'],
        trim: true,
        minlength: [2, 'Il nome prodotto deve contenere almeno 2 caratteri']
    },
    surname: {
        type: String,
        required: [true, 'Campo obbligatorio'],
        trim: true,
        minlength: [2, 'Il nome prodotto deve contenere almeno 2 caratteri']
    },
    email: {
        type: String,
        required: [true, 'Campo obbligatorio'], 
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Email non valida'], //Regex, controlla i parametri della mail:
                                                    // ^	inizio della stringa
                                                    // \S+	uno o più caratteri non spazi
                                                    // @	il simbolo @
                                                    // \.	il punto .
                                                    // $	fine della stringa
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["User", "Producer"],
        default: "User"
    },
}, {timestamps: true});

const User = mongoose.model("User", UserSchema);

module.exports = User; 