// Centralized hook to safely consume AuthContext.
// This hook throws a clear error if used outside
// AuthProvider, instead of letting every component handle `undefined`
// on its own — AuthProvider wraps the whole app in main.jsx

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}