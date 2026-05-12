//Get the role from the request
const roleMiddleware = (role) => {
    return (req, res, next) => {

        //Console.log for debug
        console.log("role richiesto:", role);
        console.log("role utente:", req.user?.role);

        //Check if the role from the request is the same
        //found on the request header
        if( req.user.role !== role)

            //If not it throws an error
            return res.status(403).json({message: "Forbidden access"});
    
            //If they are equals it moves to the next controller.
    next();
    }
};

module.exports = roleMiddleware;