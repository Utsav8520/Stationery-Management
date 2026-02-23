import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        // If no token, user is not logged in, reset state and finish loading
        setUser(null);
        setLoading(false);
        return;
      }

      // If token exists but user data is not yet set, fetch it
      // Or if the user object itself somehow indicates it needs a refresh
      // This helps prevent redundant fetches immediately after a login that already provided user data
      if (token && !user) {
        try {
          const data = await api.get("/users/me");
          setUser(data);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          setToken(null);
          localStorage.removeItem("token");
          setUser(null); // Ensure user is null on fetch error
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token, user]); // Include user in dependency array to react to its null status

  const login = (newToken, userData) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
