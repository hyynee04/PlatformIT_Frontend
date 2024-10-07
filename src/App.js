import { Outlet, useLocation } from "react-router-dom";
import "./App.scss";
import Header from "./parts/Header";
import Footer from "./parts/Footer";

import { useEffect, useState } from "react";

const App = () => {
  // const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  // const idRole = cookies.idRole || null;
  // const idUser = cookies.idUser || null;
  // useEffect(() => {
  //   if (idUser) {
  //     const userInfo = {
  //       idUser,
  //       idRole,
  //     };
  //     setUser(userInfo);
  //   }
  // }, [idUser, idRole]);
  return (
    <div className="app-container">
      <div className="header-container">
        <Header />
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
