//Import mongoose to handle DB
const mongoose = require ("mongoose");

//Import bcrypt to encript password when saved into the DB
const bcryptjs = require ('bcryptjs');

/// Define the UserSchema to structure how user data is stored in the database
// Creating a data schema called UserSchema to store user information in the DB
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Required field'],
        trim: true,
        minLength: [2, 'Name must be at least 2 characters long']
    },
    surname: {
        type: String,
        required: [true, 'Required field'],
        trim: true,
        minLength: [2, 'Surname must be at least 2 characters long']
    },
    email: {
        type: String,
        required: [true, 'Required field'], 
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email'], //Regex, validate email format:
                                                    // ^	start of the string
                                                    // \S+	one or more carachters no spaces
                                                    // @	key @
                                                    // \.	the "." dot
                                                    // $	end of the string
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



//pre('save) schema to manipulate/encrypt passwords
UserSchema.pre('save', async function() {

    //genSalt creates "salt rounds" to encrypt the password
    const salt = await bcryptjs.genSalt(10);

    //hash combines the salt rounds with the authentic password
    //if 2 users has the same passwords the final hashes will be different and both pwd will be safe
    const hash = await bcryptjs.hash (this.password, salt);
    this.password = hash; 
});

const User = mongoose.model("User", UserSchema);

module.exports = User; 