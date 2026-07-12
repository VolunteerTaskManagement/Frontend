import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authStorage } from "../services/authStorage";

interface AuthUser {
  id: number;
  userName: string;
  role: string;
  isProfileComplete: boolean;
  neighborhoodId: number | null;
  skills: number[];
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;

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

const clearStoredAuth = () => {
  authStorage.clear();
  localStorage.removeItem("user");
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const isAuthenticated = Boolean(user && accessToken);

  useEffect(() => {
    const token = authStorage.getAccessToken();
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData) as AuthUser;

        setUser(parsedUser);
        setAccessToken(token);
      } catch {
        clearStoredAuth();
      }
    } else {
      // اگر یکی از توکن یا اطلاعات کاربر وجود نداشت،
      // اطلاعات ناقص قبلی حذف شود
      clearStoredAuth();
    }

    setIsAuthLoading(false);
  }, []);

  const loginUser = (
    userData: AuthUser,
    tokens: {
      accessToken: string;
      refreshToken: string;
    }
  ) => {
    authStorage.setTokens(
      tokens.accessToken,
      tokens.refreshToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setAccessToken(tokens.accessToken);
    setUser(userData);
  };

  const logout = () => {
    clearStoredAuth();
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAuthLoading,
        loginUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};