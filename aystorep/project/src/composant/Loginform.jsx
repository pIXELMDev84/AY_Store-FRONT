import React, { useState } from 'react';
import './Loginform.css';
import logo from './image/icon.png';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.token) {
          console.log(data);
          setLoggedIn(true);
          setError('');
          localStorage.setItem('accesstoken',data.token)
          localStorage.setItem('user', JSON.stringify(data.user));

        } else {
          setError("Nom d'utilisateur ou mot de passe incorrect.");
          setLoggedIn(false);
        }
      } else {
        setError("Nom d'utilisateur ou mot de passe incorrect.");
        setLoggedIn(false);
      }
    } catch (error) {
      setError("Une erreur s'est produite lors de la connexion.");
      console.error("Erreur de connexion :", error);
      setLoggedIn(false);
    }
  };

  const handleForgotPassword = () => {
      
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <div className="centered">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      {!loggedIn && (
        <div className="blue-box">
          <h2>Connexion</h2>
        </div>
      )}
      {loggedIn ? (
        <p className="centered">Connexion réussie !</p>
      ) : (
        <>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Nom d'utilisateur :</label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe :</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <a href="#" onClick={handleForgotPassword} className="forgot-password-link">Mot de passe oublié ?</a>
            <button type="submit" className="btn btn-orange">Se connecter</button>
            {error && <p>{error}</p>}
          </form>
          <p className="centered">Pas encore de compte ? <a href="" onClick={handleRegister}>S'enregistrer</a></p>
        </>
      )}
      <button onClick={handleBackToHome} className="btn btn-orange">Retour à l'accueil</button>
    </div>
  );
}

export default LoginForm;
