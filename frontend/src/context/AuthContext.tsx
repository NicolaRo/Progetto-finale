// To store the JWT and use it to browse different pages during the session
import { createContext, useState, ReactNode } from "react";

export interface User {
    _id: string;
    name: string;
    surname?: string;
    email?: string;
    role: "User" | "Producer";
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// the function AuthProvider
function AuthProvider({ children }: AuthProviderProps) {
  // Setting states for token and User
  const [token, setToken] = useState<string | null>(sessionStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(
    JSON.parse(sessionStorage.getItem("user") as string)
  );

  // login will store token and userData
  const login = (token: string, userData: User) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  // logout will clear the information when the session is over
  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };