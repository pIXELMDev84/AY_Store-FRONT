import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faStoreAlt, faSignOutAlt, faSignInAlt, faUserPlus, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import './navbar.css';
import logo from './image/icon.png';
import Loader from './loader';
import { useNavigate } from 'react-router-dom';
import livraisonImage from './image/liv.jpg';
import nikeImage from './image/nike.jpg';
import securiteImage from './image/alp.jpg';
import image2 from './slider/n2.png';
import image1 from './slider/n1.png';
import image3 from './slider/n3.png';

function Acceuil() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const images = [image1, image2, image3];
  const accesstoken = localStorage.getItem('accesstoken');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserId(JSON.parse(user).id);
    }
  }, []);

  useEffect(() => {
    const fetchCartItemsFromBackend = async () => {
      if (userId) {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/panier/index/${userId}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setCartItems(data);
          console.log('Cart:', data);
        } catch (error) {
          setError(error.message);
          console.error('There was a problem with the fetch operation:', error);
        }
      }
    };

    if (accesstoken) {
      fetchCartItemsFromBackend();
    }
  }, [accesstoken, userId]);

  const handleShowLoginForm = () => {
    navigate('/login');
  };

  const handleShowRegisterForm = () => {
    navigate('/register');
  };

  const handleProduitPage = () => {
    navigate('/produit');
  };

  const handleProfilepage = () => {
    navigate('/profile');
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleLogout = () => {
    localStorage.removeItem('accesstoken');
    window.location.reload();
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleLoader = (isLoading) => {
    setIsLoading(isLoading);
  };

  const handleCartClick = () => {
    setShowCartDropdown(!showCartDropdown);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowCartDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      {isLoading && <Loader />}
      <div className="slider-container">
        <>
          <img
            src={images[currentImageIndex]}
            alt={`Slide ${currentImageIndex + 1}`}
            className="slider-image"
          />
          <button onClick={prevImage} className="slider-button left">
            Prev
          </button>
          <button onClick={nextImage} className="slider-button right">
            Next
          </button>
        </>
      </div>

      <nav className="navbar">
        <img src={logo} alt="Logo" className="logo" />
        <div className="menu">
          <div onClick={handleProduitPage} className="icon-container">
            <FontAwesomeIcon icon={faStoreAlt} size="lg" />
          </div>
          {accesstoken ? (
            <>
              <div onClick={handleProfilepage} className="icon-container">
                <FontAwesomeIcon icon={faUser} size="lg" />
              </div>
              <div onClick={handleCartClick} className="icon-container">
                <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                {cartItems.length > 0 && (
                  <span className="cart-badge">{cartItems.length}</span>
                )}
              </div>
              <div onClick={handleLogout} className="logout-icon-container">
                <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
              </div>
            </>
          ) : (
            <>
              <div onClick={handleShowLoginForm} className="icon-container">
                <FontAwesomeIcon icon={faSignInAlt} size="lg" />
              </div>
              <div onClick={handleShowRegisterForm} className="icon-container">
                <FontAwesomeIcon icon={faUserPlus} size="lg" />
              </div>
            </>
          )}
        </div>
      </nav>

      {showCartDropdown && (
        <div className="cart-dropdown" ref={dropdownRef}>
          <h3>Mon Panier</h3>
          {cartItems.length === 0 ? (
            <p>Votre panier est vide.</p>
          ) : (
            <>
              <ul>
                {cartItems.map((item) => (
                  <li key={item.produit.id}>{item.produit.name} - {item.produit.quantity}</li>
                ))}
              </ul>
              <button onClick={handleCheckout} className="checkout-button">
                Finaliser ma commande
              </button>
            </>
          )}
        </div>
      )}

      <div className="box-container">
        <BoxWithShadow title="Livraison Gratuite" image={livraisonImage} shadowColor="livraison" />
        <BoxWithShadow title="Partenaire Nike" image={nikeImage} shadowColor="partenaire" />
        <BoxWithShadow title="Paiement Sécurisé" image={securiteImage} shadowColor="paiement" />
      </div>

      <div className="content">
        <h1>Présentation de l'équipe AY-Store</h1>
        <p>
          Chez AY-Store, notre équipe est dévouée à offrir une expérience exceptionnelle à nos clients. Nous sommes passionnés par la mode, la qualité et l'innovation, et nous travaillons chaque jour pour offrir les meilleurs produits et services.
        </p>
      </div>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} AY-STORE. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

function BoxWithShadow({ title, image, shadowColor }) {
  const [isHovered, setIsHovered] = useState(false);

  return(
    <div
      className={`box ${shadowColor} ${isHovered ? 'hover' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3>{title}</h3>
      <img src={image} alt="Image" />
    </div>
  );
}

export default Acceuil;
