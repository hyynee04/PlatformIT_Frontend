import { Outlet, useLocation } from "react-router-dom";
import "./App.scss";
import Header from "./parts/Header";
import Footer from "./parts/Footer";

const App = () => {
  const location = useLocation(); //Lấy thông tin vị trí hiện tại
  const idRole = location.state?.idRole || null;
  const idUser = location.state?.idUser || null;
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
