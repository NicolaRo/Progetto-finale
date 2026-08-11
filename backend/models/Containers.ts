import mongoose, {Document, Schema} from "mongoose";

export interface IContainer extends Document {
    type: "Sealed" | "Non-Sealed" | "Freezer-Container";
    status: "Container ready to use" | "Container busy" | "Container ready for collection";
}

const ContainerSchema = new Schema<IContainer>({
    type: {
        type: String,
        enum: ["Sealed", "Non-Sealed", "Freezer-Container"],
        required: [true, "Choose the type of the Container"]
    },
    status: {
        type: String,
        enum: ["Container ready to use", "Container busy", "Container ready for collection"],
        required: [true, "Please choose a Container state"]
    }
}, { timestamps: true });

const Container = mongoose.model<IContainer>("Container", ContainerSchema);

export default Container;
module.exports = Container;