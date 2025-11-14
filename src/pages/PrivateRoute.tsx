import React from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../Context/UserContext";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated, myUser } = useUserContext();

  if (!myUser || !isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
