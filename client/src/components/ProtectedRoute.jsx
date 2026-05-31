import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "./ui/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner className="min-h-screen" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}
