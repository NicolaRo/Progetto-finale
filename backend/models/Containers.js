//Importo mongoose per la gestione dei dati sul DB
const mongoose = require ("mongoose");

const ContainerSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["Ermetico", "Non-Ermetico", "Contenitore da freezer"],
        required: [true, "È obbligatorio indicare il tipo di contenitore"]
    },
    availability: {
        type: Boolean,
        required: [true, "È obbligatorio indicare la disponibilità dei contenitori"]
    },
    state: {
        type: String,
        enum: ["Contenitore pronto all'uso", "Contenitore in uso", "Contenitore ritirabile"],
        required: [true, "È obbligatorio aggiornare lo stato dei contenitori"]
    }
}, {timestamps: true});

const Container = mongoose.model("Container", ContainerSchema);

module.exports = Container