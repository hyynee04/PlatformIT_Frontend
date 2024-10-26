import { Route, Routes } from "react-router-dom";

import App from "./App";
import AboutUs from "./pages/AboutUs";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserPI from "./pages/UserPI";
import Register from "./pages/Register";

import PlatformAdCenterMgmt from "./pages/centerMgmt/PlatformAdCenterMgmt";
import PlatformAdminDashboard from "./pages/home/PlatformAdminDashboard";
import PlatformAdUserMgmt from "./pages/userMgmt/PlatformAdUserMgmt";

import CenterAdCenterMgmt from "./pages/centerMgmt/CenterAdCenterMgmt";
import CenterAdminDashboard from "./pages/home/CenterAdminDashboard";
import CenterAdUserMgmt from "./pages/userMgmt/CenterAdUserMgmt";

import TeacherHome from "./pages/home/TeacherHome";

import StudentHome from "./pages/home/StudentHome";
import PrivateRoute from "./PrivateRoute";
import CenterAdPendingTask from "./pages/CenterAdPendingTask";
import LoginResponse from "./pages/LoginResponse";
import TeacherDetail from "./pages/detail/TeacherDetail";
import CenterDetail from "./pages/detail/CenterDetail";
import CourseDetail from "./pages/detail/CourseDetail";
import StudentDetail from "./pages/detail/StudentDetail";

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
          <Route path="/centerDetail" element={<CenterDetail />} />
          <Route path="/courseDetail" element={<CourseDetail />} />
          <Route path="/studentDetail" element={<StudentDetail />} />

          {/* Platform Admin */}
          <Route
            path="/platformAdDashboard"
            element={
              <PrivateRoute>
                <PlatformAdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/platformAdUser"
            element={
              <PrivateRoute>
                <PlatformAdUserMgmt />
              </PrivateRoute>
            }
          />
          <Route
            path="/platformAdCenter"
            element={
              <PrivateRoute>
                <PlatformAdCenterMgmt />
              </PrivateRoute>
            }
          />

          {/* Center Admin */}
          <Route
            path="/centerAdDashboard"
            element={
              <PrivateRoute>
                <CenterAdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/centerAdUser"
            element={
              <PrivateRoute>
                <CenterAdUserMgmt />
              </PrivateRoute>
            }
          />
          <Route
            path="/centerAdCenter"
            element={
              <PrivateRoute>
                <CenterAdCenterMgmt />
              </PrivateRoute>
            }
          />
          <Route
            path="/centerAdPendingTask"
            element={
              <PrivateRoute>
                <CenterAdPendingTask />
              </PrivateRoute>
            }
          />
          {/* Teacher */}
          <Route
            path="/teacherHome"
            element={
              <PrivateRoute>
                <TeacherHome />
              </PrivateRoute>
            }
          />

          {/* Student */}
          <Route
            path="/studentHome"
            element={
              <PrivateRoute>
                <StudentHome />
              </PrivateRoute>
            }
          />

          {/* General */}
          <Route
            path="/pi"
            element={
              <PrivateRoute>
                <UserPI />
              </PrivateRoute>
            }
          />
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
