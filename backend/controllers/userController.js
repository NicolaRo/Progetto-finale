//CRUD

//Import the model
const User = require("../models/Users");

//Import bcryptjs to encript the password
const bcrypt = require("bcryptjs");

//Import JWT for authentication
const jwt = require("jsonwebtoken");

//1. Create an User from client input
const createUser = async (req, res) => {
  const { name, surname, email, password, role } = req.body;
  try {
    if (!name || !surname || !email || !password || !role) {
      return res.status(400).json({ message: "User details are missing" });
    }
    //Look for already existing email with findOne()
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(409).json({ message: "Email already registered" });

    //If existingUser is null then create User
    const user = await User.create({
      name,
      surname,
      email,
      password, //Indicate the value to store into the DB, password is the hashedPassword for safety
      role,
    });

    //jwt.sign injects token into the user object
    //the token is then stored in the client then passed o in each HTTP header request
    const jwtToken =  jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "7d"});

    return res.status(201).json({user: user, token: jwtToken});

  } catch (error) {
    console.error("User create Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

//1.1. Log in function to include JWT Token authentication
const loginUser = async (req, res) => {

    try {
        const {email, password} = req.body;
       
        //Check if credential are submitted
        if(!email || !password)
            return res.status(404).json({message: "Credentials not found"});

        //Look for already existing user with findOne()
        const existingUser = await User.findOne({ email });

        //Check if the user is already existent
        if(!existingUser)
            return res.status(401).json({message: "Credential non valid"});
        
            //Compare the 2 password, the one from user's input and the hashed password stored in the DB
            const isMatch = await bcryptjs.compare(password, existingUser.password);

            if(!isMatch)
                return res.status(401).json({message:"Credential non valid"});

            //If data matches, then execute the jwt.sign with existing user's credentials 
            const jwtToken = jwt.sign({id: existingUser._id, role: existingUser.role}, process.env.JWT_SECRET, {expiresIn: "7d"});

            return res.status(200).json({token: jwtToken, message: "Successfully logged-in"});

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

//2.1. Read Users information
const getUsers = async (req, res) => {
  try {
    //Get all the Users registered
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//2.2. Read one specific User
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//3. Update an existing User
const updateUser = async (req, res) => {
  try {
    //3.1. Chech if the user wants to edit the password
    if (req.body.password) {
      //3.2. Overwrite the new password already hashed
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    //3.3. passing the req. body to the updateUser
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//4. Delete an User
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "USer deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser
};
