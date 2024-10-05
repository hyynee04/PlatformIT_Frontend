import { Route, Routes } from "react-router-dom";

import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import PlatformAdminPI from "./pages/pi/PlatformAdminPI";

import StudentPI from "./pages/pi/StudentPI";
import StudentHome from "./pages/home/StudentHome";

import TeacherPI from "./pages/pi/TeacherPI";
import TeacherHome from "./pages/home/TeacherHome";
import CenterAdminDashboard from "./pages/home/CenterAdminDashboard";
import PlatformAdminDashboard from "./pages/home/PlatformAdminDashboard";

const Layout = (props) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<App />}>
          {/* Guest */}
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Platform Admin */}
          <Route
            path="/platformAdminDashboard"
            element={<PlatformAdminDashboard />}
          />
          <Route path="/platformAdminPI" element={<PlatformAdminPI />} />

          {/* Center Admin */}
          <Route
            path="/centerAdminDashboard"
            element={<CenterAdminDashboard />}
          />

          {/* Teacher */}
          <Route path="/teacherHome" element={<TeacherHome />} />
          <Route path="/teacherPI" element={<TeacherPI />} />

          {/* Student */}
          <Route path="/studentHome" element={<StudentHome />} />
          <Route path="/studentPI" element={<StudentPI />} />
        </Route>

        {/* <Route path='admin' element={<Admin />}>
                    <Route index element={<DashBoard />} />
                    <Route path='manage-user' element={<ManageUser />} />
                </Route> */}
      </Routes>
    </>
  );
};

export default Layout;
