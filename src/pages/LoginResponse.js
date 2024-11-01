import { React, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LoginResponse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');

  // Parse the query parameters from location.search
  const queryParams = new URLSearchParams(location.search);
  const idUser = queryParams.get('idUser');
  const idRole = queryParams.get('idRole');
  //const status = queryParams.get('status');
  const messageParam = queryParams.get('message');
  console.log(queryParams)
  useEffect(() => {
    // If idUser and idRole are available, store them in localStorage and navigate
    if (idUser && idRole) {
      localStorage.setItem('idUser', idUser);
      localStorage.setItem('idRole', idRole);

      // Optionally navigate to another page after storing the values
      navigate('/login', {
        state: { idUser, idRole },
      });
    }
    // If message is present, decode it and navigate with the message in state
    else if (messageParam) {
      const decodedMessage = decodeURIComponent(messageParam);
      setMessage(decodedMessage);

      // Navigate to the login page with the message
      navigate('/login', {
        state: { message: decodedMessage },
      });
    }
  }, [idUser, idRole, messageParam, navigate]);

  return (
    <div>
      <h1>Login Response</h1>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginResponse;
