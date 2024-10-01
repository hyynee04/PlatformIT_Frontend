import './App.scss';

import { Outlet } from 'react-router-dom';
import Header from './components/Header/Header';

const App = () => {

  return (
    <div className="app-container">
      <div className='header-container'>
        <Header />
      </div>
      <div className='main-container'>
        <div className='app-content'>
          <Outlet></Outlet>
        </div>
      </div>

    </div>
  );
}

export default App;
