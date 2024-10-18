import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LoginSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Parse the query parameters from location.search
  const queryParams = new URLSearchParams(location.search);
  const idUser = queryParams.get('idUser');
  const idRole = queryParams.get('idRole');

  React.useEffect(() => {
    if (idUser && idRole) {
      
      localStorage.setItem('idUser', idUser);
      localStorage.setItem('idUser', idRole);

      // Optionally navigate to another page
      navigate('/login', {
        state: { idUser, idRole },
      });
    } else {
      console.error('Missing idUser or idRole in query parameters');
    }
  }, [idUser, idRole, navigate]);

  return (
    <div>
      <h1>Login Successful</h1>
      <p>Redirecting...</p>
    </div>
  );
};

export default LoginSuccess;
