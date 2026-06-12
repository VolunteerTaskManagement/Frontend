import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { authStorage } from "../services/authStorage";

interface AuthUser {
  id: number;
  userName: string;
  role: string;
  isProfileComplete: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loginUser: (
    user: AuthUser,
    tokens: {
      accessToken: string;
      refreshToken: string;
    }
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    const token = authStorage.getAccessToken();
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const loginUser = (userData: AuthUser, tokens: any) => {
    authStorage.setTokens(
      tokens.accessToken,
      tokens.refreshToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  const logout = () => {
    authStorage.clear();
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loginUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
};