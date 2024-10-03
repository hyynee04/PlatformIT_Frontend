import { Route, Routes } from "react-router-dom";

import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// import PlatformAdminPI from "./pages/home/PlatformAdminPI";

import StudentPI from "./pages/pi/StudentPI";
import StudentHome from "./pages/home/StudentHome";

import TeacherPI from "./pages/pi/TeacherPI";
import TeacherHome from "./pages/home/TeacherHome";

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
          {/* <Route path="/platformAdminPI" index element={<PlatformAdminPI />} /> */}

          {/* Center Admin */}

          {/* Teacher */}
          <Route path="/teacherHome" index element={<TeacherHome />} />
          <Route path="/teacherPI" index element={<TeacherPI />} />

          {/* Student */}
          <Route path="/studentHome" index element={<StudentHome />} />
          <Route path="/studentPI" index element={<StudentPI />} />
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
