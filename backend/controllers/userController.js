//CRUD


//Import the model
const User = require ("../models/Users");

//1. Create an User from client input
const createUser = async (req, res) => {

    const {name, surname, email, password, role} = req.body;
    try {
    

    

        if(!name || !surname || !email || !password || !role) {
            return res.status(400).json({message: "User details are missing"});
            }
            //Look for already existing email with findOne()
            const existingUser = await User.findOne({email});
            
            if (existingUser)
                return res.status(409).json({message: "Email already registered"});
            //If existingUser is null then create User
                const user = await User.create ({
                    name,
                    surname,
                    email,
                    password,
                    role
                });

            return res.status(201).json(user);

        
    } catch (error) {
        console.error('User create Error:', error);
        return res.status(500).json ({message: error.message});
}
}
module.exports = {
    createUser,
}