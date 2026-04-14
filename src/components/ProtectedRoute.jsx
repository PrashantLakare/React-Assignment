import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../auth/auth";

function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search + location.hash }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;

