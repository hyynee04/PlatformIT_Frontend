import { Outlet } from "react-router-dom";
import "./App.css";
import Footer from "./parts/Footer";
import Header from "./parts/Header";

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
