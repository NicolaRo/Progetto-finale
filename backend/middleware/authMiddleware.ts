import jwtToken, {JwtPayload} from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";

//Read Authorization header from HTTP request
const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        //Get the authorization from the request's header
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            res.status(401).json({message: "Missing Token"});
            return;
        }

        //Split the authorization and take the token alone
        // *** the authorization format is: "Bearer eyJhbGciOiJIUzI1NiJ9..." ***
        // "[1]"  removes second element: "bearer"
        const token = authHeader.split(" ")[1];

        if (!token) {
            res.status(410).json({message: "Missing Token"});
            return;
        }

        //decoded takes the _id and the role together and it checks if the token is still valid
        const decoded: string | JwtPayload = jwtToken.verify(token, process.env.JWT_SECRET as string);

        //req.user passes decoded into each HTTP request the client perform.
        req.user = decoded;

        //to move on to the next controller
        next();
    } catch (error) {
        //Invalid or expired token client's fault not server's
        res.status(401).json({message: (error as Error).message});
    }
};

export default authMiddleware;
module.exports = authMiddleware;