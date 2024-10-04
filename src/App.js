import { Outlet, useLocation } from "react-router-dom";
import "./App.scss";
import Header from "./parts/Header";
import Footer from "./parts/Footer";
import { useCookies } from "react-cookie";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const location = useLocation(); //Lấy thông tin vị trí hiện tại
  const idRole = location.state?.idRole || cookies.idRole;
  const idUser = location.state?.idUser || cookies.idUser;
  // console.log(idRole);

  return (
    <div className="app-container">
      <div className="header-container">
        <Header idRole={idRole} idUser={idUser} />
      </div>
      <div className="main-container">
        <div className="app-content">
          <Outlet></Outlet>
        </div>
      </div>
      <div className="footer-container">
        <Footer />
      </div>
    </div>
  );
};

export default App;
