import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading authentication...</div>; // Or a loading spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Redirect unauthorized users
  }

  return <Outlet />;
};

export default ProtectedRoute;
