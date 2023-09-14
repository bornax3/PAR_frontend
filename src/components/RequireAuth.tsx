import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { userToken, roles } = useAuth();
  const location = useLocation();

  // Check if the user's roles intersect with the allowed roles
  const isAuthorized = roles
    ? allowedRoles.some((role) => roles.includes(role))
    : false;

  console.log("Roles in require auth:", roles);
  console.log("Allowed Roles:", allowedRoles);

  return userToken && isAuthorized ? (
    <Outlet />
  ) : userToken ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
