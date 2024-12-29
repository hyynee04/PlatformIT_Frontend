import { Route, Routes } from "react-router-dom";
import { Role } from "./constants/constants";
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
import PlatformAdCourseMgmt from "./pages/courseMgmt/PlarformAdCourseMgmt";
import PlatformAdminDashboard from "./pages/home/PlatformAdminDashboard";
import PlatformAdUserMgmt from "./pages/userMgmt/PlatformAdUserMgmt";

import CenterAdPendingTask from "./pages/CenterAdPendingTask";
import CenterAdCenterMgmt from "./pages/centerMgmt/CenterAdCenterMgmt";
import PendingApproveCenter from "./pages/centerMgmt/PendingApproveCenter";
import AddNewCourse from "./pages/courseMgmt/AddNewCourse";
import UpdateCourse from "./pages/courseMgmt/UpdateCourse";
import CenterAdCourseMgmt from "./pages/courseMgmt/CenterAdCourseMgmt";
import CenterAdminDashboard from "./pages/home/CenterAdminDashboard";
import CenterAdUserMgmt from "./pages/userMgmt/CenterAdUserMgmt";

import AddNewAssign from "./pages/assignmentMgmt/AddNewAssign";
import DuplicateAssign from "./pages/assignmentMgmt/DuplicateAssign";
import AssignDetail from "./pages/assignmentMgmt/AssignDetail";
import ListAssignMgmt from "./pages/assignmentMgmt/ListAssignMgmt";
import UpdateAssignment from "./pages/assignmentMgmt/UpdateAssignment";
import TeacherCourseMgmt from "./pages/courseMgmt/TeacherCourseMgmt";
import AddNewLecture from "./pages/lectureMgmt/AddNewLecture";

import StartAssign from "./pages/assignmentMgmt/StartAssign";
import StudentCourseMgmt from "./pages/courseMgmt/StudentCourseMgmt";

import AllNotifications from "./pages/AllNotifications";
import Lecture from "./pages/lectureMgmt/Lecture";
import ViewAll from "./pages/ViewAll";
import AdminCenterDetail from "./pages/detail/AdminCenterDetail";
import Chat from "./pages/Chat";
import Transaction from "./pages/Transaction";
import TransactionResponse from "./pages/TransactionResponse";

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
                <Home role={Role.guest} />
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

          <Route
            path="/studentDetail"
            element={
              <PrivateRoute>
                <StudentDetail />
              </PrivateRoute>
            }
          />

          <Route
            path="/adminCenterDetail"
            element={
              <PrivateRoute>
                <AdminCenterDetail />
              </PrivateRoute>
            }
          />

          <Route
            path="/viewLecture"
            element={
              <PrivateRoute>
                <Lecture />
              </PrivateRoute>
            }
          />

          <Route path="/viewAll" element={<ViewAll />} />

          <Route
            path="/allNotifications"
            element={
              <PrivateRoute>
                <AllNotifications />
              </PrivateRoute>
            }
          />

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
          <Route
            path="/updateCourse"
            element={
              <PrivateRoute>
                <UpdateCourse />
              </PrivateRoute>
            }
          />

          {/* Teacher */}
          <Route
            path="/teacherHome"
            element={
              <PrivateRoute>
                <Home role={Role.teacher} />
              </PrivateRoute>
            }
          />
          <Route
            path="/teacherAssignment"
            element={
              <PrivateRoute>
                <ListAssignMgmt />
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
          <Route
            path="/duplicateAssignment"
            element={
              <PrivateRoute>
                <DuplicateAssign />
              </PrivateRoute>
            }
          />
          <Route
            path="/updateAssignment"
            element={
              <PrivateRoute>
                <UpdateAssignment />
              </PrivateRoute>
            }
          />
          <Route
            path="/teacherAssignDetail"
            element={
              <PrivateRoute>
                <AssignDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/teacherCourse"
            element={
              <PrivateRoute>
                <TeacherCourseMgmt />
              </PrivateRoute>
            }
          />
          <Route
            path="/addNewLecture"
            element={
              <PrivateRoute>
                <AddNewLecture />
              </PrivateRoute>
            }
          />

          {/* Student */}
          <Route
            path="/studentHome"
            element={
              <PrivateRoute>
                <Home role={Role.student} />
              </PrivateRoute>
            }
          />
          <Route
            path="/studentCourse"
            element={
              <PrivateRoute>
                <StudentCourseMgmt />
              </PrivateRoute>
            }
          />
          <Route
            path="/studentTest"
            element={
              <PrivateRoute>
                <ListAssignMgmt />
              </PrivateRoute>
            }
          />
          <Route
            path="/studentAssignDetail"
            element={
              <PrivateRoute>
                <AssignDetail />
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
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
          <Route
            path="/transaction"
            element={
              <PrivateRoute>
                <Transaction />
              </PrivateRoute>
            }
          />
        </Route>
        <Route
          path="/startAssignment"
          element={
            <PrivateRoute>
              <StartAssign />
            </PrivateRoute>
          }
        />
        <Route
          path="/transactionResponse"
          element={
            <PrivateRoute>
              <TransactionResponse />
            </PrivateRoute>
          }
        />
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
