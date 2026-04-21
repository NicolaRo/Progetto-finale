//Import mongoose to handle DB
const mongoose = require ("mongoose");

/// Define the UserSchema to structure how user data is stored in the database
// Creating a data schema called UserSchema to store user information in the DB
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Required field'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long']
    },
    surname: {
        type: String,
        required: [true, 'Required field'],
        trim: true,
        minlength: [2, 'Surname must be at least 2 characters long']
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

const User = mongoose.model("User", UserSchema);

module.exports = User; 