//Importo mongoose per la gestione dei dati sul DB
const mongoose = require ("mongoose");

const ContainerSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["Sealed", "Non-Sealed", "Freezer"],
        required: [true, "È obbligatorio indicare il tipo di contenitore"]
    },
    availability: {
        type: Boolean,
        enum: {default: "true"},
        required: [true, "È obbligatorio indicare la disponibilità dei contenitori"]
    },
    state: {
        type: String,
        enum: ["Ready to use", "In Use", "Collectable"],
        required: [true, "È obbligatorio aggiornare lo stato dei contenitori"]
    }
}, {timestamps: true});

const Container = mongoose.model("Container", ContainerSchema);

module.exports = Container