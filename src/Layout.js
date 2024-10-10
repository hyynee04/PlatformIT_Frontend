import { Route, Routes } from "react-router-dom";

import App from "./App";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserPI from "./pages/pi/UserPI";

import PlatformAdminDashboard from "./pages/home/PlatformAdminDashboard";
import PlatformAdUserMgmt from "./pages/userMgmt/PlatformAdUserMgmt";
import PlatformAdCenterMgmt from "./pages/centerMgmt/PlatformAdCenterMgmt";

import CenterAdminDashboard from "./pages/home/CenterAdminDashboard";

import TeacherPI from "./pages/pi/TeacherPI";
import TeacherHome from "./pages/home/TeacherHome";

import StudentHome from "./pages/home/StudentHome";
import CenterAdUserMgmt from "./pages/userMgmt/CenterAdUserMgmt";

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

          {/* Teacher */}
          <Route path="/teacherHome" element={<TeacherHome />} />
          <Route path="/teacherPI" element={<TeacherPI />} />

          {/* Student */}
          <Route path="/studentHome" element={<StudentHome />} />

          {/* General */}
          <Route path="/pi" element={<UserPI />} />
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
