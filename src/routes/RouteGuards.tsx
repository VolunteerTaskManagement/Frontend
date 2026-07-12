import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AuthLoading = () => {
  return <div>در حال بررسی وضعیت ورود...</div>;
};

export const ProtectedRoute = () => {
  const {
    isAuthenticated,
    isAuthLoading,
  } = useAuth();

  const location = useLocation();

  if (isAuthLoading) {
    return <AuthLoading />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
};

export const PublicOnlyRoute = () => {
  const {
    isAuthenticated,
    isAuthLoading,
  } = useAuth();

  if (isAuthLoading) {
    return <AuthLoading />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};