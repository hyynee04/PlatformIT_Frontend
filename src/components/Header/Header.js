import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink, useNavigate } from 'react-router-dom';

import "../Header/Header.scss"

const Header = () => {
    const navigate = useNavigate();
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <NavLink to="/" className='navbar-brand'>
                    <div className='logo-container'>
                        <div className='logo-brand'>

                        </div>
                    </div>
                </NavLink>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/" className='active'>Home</Nav.Link>
                        <Nav.Link href="/aboutus">About us</Nav.Link>
                    </Nav>
                    <div className="auth-buttons">
                        <button 
                            className='buts sign-in'
                            onClick={() => navigate('/login')}
                        >Sign in</button>
                        <button 
                            className='buts register'
                            onClick={() => navigate('/register')}
                        >Register</button>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header;