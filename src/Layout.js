import {
    Route,
    Routes
} from 'react-router-dom';

import App from './App';
import Home from './components/Home/Home';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';

const Layout = (props) => {
    return (
        <>
            <Routes>
                <Route path='/' element={<App />} >
                    <Route index element={<Home />} />
                    {/* <Route path='user' element={<User />} /> */}
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />}/>
                </Route>

                {/* <Route path='admin' element={<Admin />}>
                    <Route index element={<DashBoard />} />
                    <Route path='manage-user' element={<ManageUser />} />
                </Route> */}

            </Routes>
        </>
    )

}

export default Layout;