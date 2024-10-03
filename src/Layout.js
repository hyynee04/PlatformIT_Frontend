import { Route, Routes } from "react-router-dom";

import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Student from "./pages/pi/StudentPI";
import Teacher from "./pages/pi/TeacherPI";

const Layout = (props) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pi_teacher" index element={<Teacher />} />
          <Route path="/pi_student" index element={<Student />} />
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
