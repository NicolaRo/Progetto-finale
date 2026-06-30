//Import mongoose to handle DB
const mongoose = require ("mongoose");

const ContainerSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["Sealed", "Non-Sealed", "Freezer-Container"],
        required: [true, "Choose the type of the Container"]
    },
    status: {
        type: String,
        enum: ["Container ready to use", "Container busy", "Container ready for collection"],
        required: [true, "Please choose a Container state"]
    }
}, {timestamps: true});

const Container = mongoose.model("Container", ContainerSchema);

module.exports = Container