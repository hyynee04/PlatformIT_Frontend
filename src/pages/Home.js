import "../assets/scss/Home.css";
import Slide from "../components/Slide";
import logoPlait from "../assets/img/logoPlait.png"

const Home = () => {
  return (
    <div>
      <div className="home-main-container">
        <div className="introduction-container">
          <div className="left-introduction">
            <span className="introduction-brand-title">WELCOME TO <b>PLAIT</b></span>
            <span className="introduction-brand-name">Platform for IT Learning</span>
            <div className="introduction-register">
              <span>Join us now</span>
              <button>Register</button>
            </div>
          </div>
          <div className="right-introduction">
            <img className="rotate " src={logoPlait}/>
          </div>
        </div>
        <Slide />
      </div>
    </div>
  );
};

export default Home;
