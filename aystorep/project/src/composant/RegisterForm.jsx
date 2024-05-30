import React, { useState } from 'react';
import './RegisterForm.css';
import logo from './image/icon.png';
import Loader from './loader';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function RegisterForm() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateInputs = () => {
    if (name.length < 3) {
      setError("Le nom doit comporter au moins 3 caractères.");
      return false;
    }
    if (username.length < 4) {
      setError("Le nom d'utilisateur doit comporter au moins 4 caractères.");
      return false;
    }
    if (!email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      setError("L'adresse email n'est pas valide.");
      return false;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit comporter au moins 6 caractères.");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validateInputs()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, username, email, password }),
      });
      if (response.ok) {
        setRegistered(true);
        setError('');
        console.log("Connexion réussie !");
        
      } else {
        setError("Erreur lors de l'inscription.");
        setRegistered(false);
      }
    } catch (error) {
      setError("Une erreur s'est produite lors de l'inscription.");
      console.error("Erreur d'inscription :", error);
      setRegistered(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="register-form-container">
      <img src={logo} alt="Logo" className="logo" />
      {isLoading && <Loader />}
      {registered ? (
        <p>L'enregistrement a été effectué avec succès !</p>
      ) : (
        <>
          <h2>Inscription</h2>
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="name">Nom :</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
              <label htmlFor="email">Email :</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            
            <button type="submit" className="btn btn-orange">S'inscrire</button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </>
      )}
      <button onClick={handleBackToHome} className="btn btn-orange">Retour à l'accueil</button>
      <p>
        Vous avez déjà un compte?{' '}
        <Link to="/login">Connectez-vous ici</Link>
      </p>
    </div>
  );
}

export default RegisterForm;
