//To store the JWT and use it to browse different pages during the session
import { createContext, useState} from "react";

const AuthContext = createContext();

//the function AuthProvider 
function AuthProvider({children}) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);


    //login will store token and userData 
    const login = (token, userData) => {
        setToken (token);
        setUser(userData);
    };

    //logout will clear the information when the session is over
    const logout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{token, user, login, logout}}>
        {children}
        </AuthContext.Provider>
    );
}

export {AuthContext, AuthProvider}; 
