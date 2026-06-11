//Import JWT for authentication
const jwtToken = require("jsonwebtoken");

//Read Authorization header from the HTTP request
const authMiddleware = async (req, res, next) => {
    try {
        //Get the authorization from the request's header
        const authHeader = req.headers.authorization;

        if (!authHeader)
            return res.status(401).json({message: "Missing Token"});

        //Split the authorization and take the token alone
        // *** the authorization format is: "Bearer eyJhbGciOiJIUzI1NiJ9..." ***
        // "[1]"  removes second element: "bearer" 
        const token = authHeader.split(" ")[1];

        //decoded takes the _id and the role together and it checks if the token is still valid
        const decoded = jwtToken.verify(token, process.env.JWT_SECRET);

        //req.user passes decoded into each HTTP request the client perform.
        req.user = decoded;

        //To move on to the next controller
        next();

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

module.exports = authMiddleware;