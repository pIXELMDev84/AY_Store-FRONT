import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faSignInAlt, faUserPlus, faHome, faShoppingCart, faSearch } from '@fortawesome/free-solid-svg-icons';
import './navbar.css';
import logo from './image/icon.png';
import Loader from './loader';
import './footer.css';
import './slider.css';
import './acceuil.css';
import './produit.css';

import { useNavigate } from 'react-router-dom';

function Produit() {
  const [isLoading, setIsLoading] = useState(false);
  const [produits, setProduits] = useState([]);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [message, setMessage] = useState('');
  const accessToken = localStorage.getItem('accesstoken');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const accesstoken = localStorage.getItem('accesstoken');
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredProduits = produits.filter(produit =>
    produit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCartClick = () => {
    setShowCartDropdown(!showCartDropdown);
  };

  const handleShowLoginForm = () => {
    navigate('/login');
  };

  const handleShowRegisterForm = () => {
    navigate('/register');
  };

  const handleProfilepage = () => {
    navigate('/profile');
  };

  const handleBackToHome = () => {
    navigate('/');
  };
  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleLogout = () => {
    localStorage.removeItem('accesstoken');
    navigate('/');
  };

  const handleProduitClick = (produit) => {
    setSelectedProduit(produit);
  };

  const handleClosePopup = () => {
    setSelectedProduit(null);
    setMessage('');
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowCartDropdown(false);
    }
  };

  const handleAddToCartOrFavorites = async (action) => {
    if (!accessToken) {
      setMessage('Vous devez vous connecter pour effectuer cette action.');
      return;
    }

    const userId = JSON.parse(localStorage.getItem('user')).id;
    const user_id = userId;
    const produit_id = selectedProduit.id;
    const endpoint = action === 'favorites' ? 'favorite/add' : 'panier/add';
  
    try {
      const response = await fetch(`http://localhost:8000/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, produit_id }),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        setMessage(`Le produit a été ajouté aux ${action === 'favorites' ? 'favoris' : 'panier'}.`);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else if (response.status === 400) {
        const responseData = await response.json();
        setMessage(responseData.message);
      } else {
        setMessage('Une erreur s\'est produite. Veuillez réessayer ultérieurement.');
      }
    } catch (error) {
      setMessage('Une erreur s\'est produite. Veuillez réessayer ultérieurement.');
    }
  };

  useEffect(() => {
    const fetchProduits = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/produits');
        const data = await response.json();
        setProduits(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduits();
  }, []);

  return (
    <div>
      {isLoading && <Loader />}
      <nav className="navbar">
        <div>
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="search-bar">
          <span className="search-icon">
            <FontAwesomeIcon icon={faSearch} size="lg" />
          </span>
          <input
            type="text"
            placeholder="Rechercher par nom de produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="menu">
          <div onClick={handleBackToHome} className="icon-container">
            <FontAwesomeIcon icon={faHome} size="lg" />
          </div>
          {accessToken ? (
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

      <div className="filter-buttons">
        <button onClick={() => navigate('/produit/new')} className="filter-button">Nouveaux Produits</button>
        <button className="filter-button">Tous les Produits</button>
      </div>

      <div className="produits-container">
        {filteredProduits.map((produit) => (
          <div key={produit.id} className="produit-card" onClick={() => handleProduitClick(produit)}>
            <div className="produit-name">{produit.name}</div>
            {produit.image && (
              <img src={`http://127.0.0.1:8000/storage/${produit.image}`} alt={produit.name} />
            )}
          </div>
        ))}
      </div>

      {selectedProduit && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-button" onClick={handleClosePopup}>×</button>
            <h2>{selectedProduit.name}</h2>
            <p>{selectedProduit.small_desc}</p>
            <p>Prix: {selectedProduit.prix}</p>
            <p>Quantité: {selectedProduit.qte}</p>
            {selectedProduit.image && (
              <img src={`http://127.0.0.1:8000/storage/${selectedProduit.image}`} alt={selectedProduit.name} />
            )}
            <p>{message}</p>
            <div className="popup-buttons">
              <button className="popup-button" onClick={() => handleAddToCartOrFavorites('favorites')}>Ajouter aux favoris</button>
              <button className="popup-button" onClick={() => handleAddToCartOrFavorites('cart')}>Ajouter au panier</button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} AY-STORE. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default Produit;
