import {Request, Response, NextFunction} from "express";
import {JwtPayload} from "jsonwebtoken";

//Get the role from the request
const roleMiddleware = (role: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {

        //if req.user doesn't existst, the authenticaition middleware
        //wasn't executed before, throw route configuration error
        if(!req.user) {
            res.status(401).json({message: "Unauthorized"});
            return;
        }

        //req.user can be a string or a JwtPayload: ontly the 2nd has .role
        const userRole = typeof req.user === "string" ? undefined : (req.user as JwtPayload).role;
        
        //Check if the role from the request is the same found on the request header
        if(userRole!== role) {
            //if not throws an error
            res.status(403).json({message: "Forbidden access"});
            return;
        }

        //If they correspond it moves to the next controller.
        next();
    };
};
export default roleMiddleware;
module.exports = roleMiddleware;