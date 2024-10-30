import { Navigate } from "react-router-dom";
import { Role } from "./constants/constants";

const GuestRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("idUser");
  const idRole = +localStorage.getItem("idRole");

  if (isAuthenticated) {
    if (idRole === Role.platformAdmin) {
      return <Navigate to="/platformAdDashboard" replace />;
    } else if (idRole === Role.centerAdmin) {
      return <Navigate to="/centerAdDashboard" replace />;
    } else if (idRole === Role.teacher) {
      return <Navigate to="/teacherHome" replace />;
    } else if (idRole === Role.student) {
      return <Navigate to="/studentHome" replace />;
    }
  }
  return children;
};

export default GuestRoute;
