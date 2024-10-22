import { Route, Routes } from "react-router-dom";

import App from "./App";
import AboutUs from "./pages/AboutUs";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserPI from "./pages/pi/UserPI";
import Register from "./pages/Register";

import PlatformAdCenterMgmt from "./pages/centerMgmt/PlatformAdCenterMgmt";
import PlatformAdminDashboard from "./pages/home/PlatformAdminDashboard";
import PlatformAdUserMgmt from "./pages/userMgmt/PlatformAdUserMgmt";

import CenterAdCenterMgmt from "./pages/centerMgmt/CenterAdCenterMgmt";
import CenterAdminDashboard from "./pages/home/CenterAdminDashboard";
import CenterAdUserMgmt from "./pages/userMgmt/CenterAdUserMgmt";

import TeacherHome from "./pages/home/TeacherHome";
import TeacherPI from "./pages/pi/TeacherPI";

import StudentHome from "./pages/home/StudentHome";
import LoginResponse from "./pages/LoginResponse";
import TeacherDetail from "./pages/detail/TeacherDetail";

const Layout = (props) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<App />}>
          {/* Guest */}
          <Route index element={<Home />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/teacherDetail" element={<TeacherDetail />} />

          {/* Platform Admin */}
          <Route
            path="/platformAdDashboard"
            element={<PlatformAdminDashboard />}
          />
          <Route path="platformAdUser" element={<PlatformAdUserMgmt />} />
          <Route path="platformAdCenter" element={<PlatformAdCenterMgmt />} />

          {/* Center Admin */}
          <Route path="/centerAdDashboard" element={<CenterAdminDashboard />} />
          <Route path="/centerAdUser" element={<CenterAdUserMgmt />} />
          <Route path="/centerAdCenter" element={<CenterAdCenterMgmt />} />

          {/* Teacher */}
          <Route path="/teacherHome" element={<TeacherHome />} />
          <Route path="/teacherPI" element={<TeacherPI />} />

          {/* Student */}
          <Route path="/studentHome" element={<StudentHome />} />

          {/* General */}
          <Route path="/pi" element={<UserPI />} />
        </Route>

        <Route path="/login-response" element={<LoginResponse />} />
        {/* <Route path='admin' element={<Admin />}>
                    <Route index element={<DashBoard />} />
                    <Route path='manage-user' element={<ManageUser />} />
                </Route> */}
      </Routes>
    </>
  );
};

export default Layout;
