//To store the JWT and use it to browse different pages during the session
import { createContext, useState} from "react";

const AuthContext = createContext();

//the function AuthProvider 
function AuthProvider({children}) {

    //Setting states for token and User
    const [token, setToken] = useState(sessionStorage.getItem('token'));
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));


    //login will store token and userData 
    const login = (token, userData) => {
        
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(userData));
        setToken(token);
        setUser (user); 
    };

    //logout will clear the information when the session is over
    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
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
