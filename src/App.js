import { Outlet } from "react-router-dom";
import "./App.scss";
import Header from "./parts/Header";
import Footer from "./parts/Footer";

const App = () => {
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
