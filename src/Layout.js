import { Route, Routes } from "react-router-dom";

import App from "./App";
import GuestRoute from "./GuestRoute";
import PrivateRoute from "./PrivateRoute";

import AboutUs from "./pages/AboutUs";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LoginResponse from "./pages/LoginResponse";
import Register from "./pages/Register";

import CenterDetail from "./pages/detail/CenterDetail";
import CourseDetail from "./pages/detail/CourseDetail";
import StudentDetail from "./pages/detail/StudentDetail";
import TeacherDetail from "./pages/detail/TeacherDetail";
import UserPI from "./pages/UserPI";

import PlatformAdCenterMgmt from "./pages/centerMgmt/PlatformAdCenterMgmt";
import PlatformAdminDashboard from "./pages/home/PlatformAdminDashboard";
import PlatformAdUserMgmt from "./pages/userMgmt/PlatformAdUserMgmt";

import CenterAdPendingTask from "./pages/CenterAdPendingTask";
import CenterAdCenterMgmt from "./pages/centerMgmt/CenterAdCenterMgmt";
import PendingApproveCenter from "./pages/centerMgmt/PendingApproveCenter";
import AddNewCourse from "./pages/courseMgmt/AddNewCourse";
import CenterAdCourseMgmt from "./pages/courseMgmt/CenterAdCourseMgmt";
import CenterAdminDashboard from "./pages/home/CenterAdminDashboard";
import CenterAdUserMgmt from "./pages/userMgmt/CenterAdUserMgmt";

import AddNewAssign from "./pages/assignmentMgmt/AddNewAssign";
import TeacherHome from "./pages/home/TeacherHome";

import StudentHome from "./pages/home/StudentHome";

import PlatformAdCourseMgmt from "./pages/courseMgmt/PlarformAdCourseMgmt";
import ViewAll from "./pages/ViewAll";
import TeacherAssignMgmt from "./pages/assignmentMgmt/TeacherAssignMgmt";

const Layout = (props) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<App />}>
          {/* Guest */}
          <Route
            index
            element={
              <GuestRoute>
                <Home />
              </GuestRoute>
            }
          />
          <Route
            path="/aboutUs"
            element={
              <GuestRoute>
                <AboutUs />
              </GuestRoute>
            }
          />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />

          <Route path="/teacherDetail" element={<TeacherDetail />} />
          <Route path="/centerDetail" element={<CenterDetail />} />
          <Route path="/courseDetail" element={<CourseDetail />} />
          <Route path="/studentDetail" element={<StudentDetail />} />

          <Route path="/viewAll" element={<ViewAll />} />

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
          <Route
            path="/platformAdCourse"
            element={
              <PrivateRoute>
                <PlatformAdCourseMgmt />
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
          <Route
            path="/centerAdCourse"
            element={
              <PrivateRoute>
                <CenterAdCourseMgmt />
              </PrivateRoute>
            }
          />
          <Route
            path="/addCourse"
            element={
              <PrivateRoute>
                <AddNewCourse />
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
          <Route
            path="/teacherAssignment"
            element={
              <PrivateRoute>
                <TeacherAssignMgmt />
              </PrivateRoute>
            }
          />
          <Route
            path="/addAssignment"
            element={
              <PrivateRoute>
                <AddNewAssign />
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
          <Route
            path="/pendingCenter"
            element={
              <PrivateRoute>
                <PendingApproveCenter />
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
