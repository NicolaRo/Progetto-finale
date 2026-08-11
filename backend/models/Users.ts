import mongoose, {Document, Schema} from "mongoose";
import bcryptjs from "bcryptjs";

//User's data format
export interface IUser extends Document {
    name: string;
    surname: string;
    email: string;
    password: string;
    role: "User" | "Producer";
    resetPasswordToken?: string;
    resetPasswordExpires?: Date; 
}

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required:[true, 'Required field'],
        trim: true,
        minLength: [2, 'Name must be at least 2 characters long']
    },
    surname: {
        type: String,
        required: [true, 'Required field'],
        trim: true,
        minlength: [2, 'Surname must be at least 2 characters logn']
    },
    email: {
        type: String,
        required: [true, ' Required field'],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
        trim: true,
    },
    password: {
        type: String,
        required: true, 
    },
    role: {
        type: String,
        enum: ["User", "Producer"],
        default: "User"
    },
    //temporary token to reset PWD
    resetPasswordToken: {
        type: String,
    },
    //Exporation token after 1h
    resetPasswordExpires: {
        type: Date,
    },
}, {timestamps: true});

//pre('save') schema to manipulate/encrypt passwords
UserSchema.pre('save', async function (this:IUser) {

    //Prevent encripting passworf if unnecessary
    //(if the user update other info, an alreadu encripted password) should not be encripted again
    if(!this.isModified('password')) return;

    //genSalt creates "salt rounds" to encrypt the Password
    const salt = await bcryptjs.genSalt(10);

    //hash combines the salt rounds with the autentic password
    // if 2 users has the same password the final hashes will still be ddifferent
    const hash = await bcryptjs.hash(this.password, salt);
    this.password = hash;
});

const User = mongoose.model<IUser>("User",UserSchema);

export default User;

module.exports = User;