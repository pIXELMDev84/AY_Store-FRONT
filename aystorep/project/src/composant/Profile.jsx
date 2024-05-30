import React, { useEffect, useState } from 'react';
import './profilenav.css';
import { useNavigate } from 'react-router-dom';
import logo from './image/prp.png';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showFullEmail, setShowFullEmail] = useState(false);
  const [favorites, setFavorites] = useState({ produit: [] });
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accesstoken');
    if (!accessToken) {
      navigate('/');
    } else {
      setLoading(false);
      handleFavorites();
      handleUserOrders();
    }
  }, [navigate]);

  const handleFavorites = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    const userId = userData.id;

    fetch(`http://127.0.0.1:8000/api/favorite/index/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setFavorites(data);
        console.log('Favorites:', data);
      })
      .catch(error => {
        setError(error.message);
        console.error('There was a problem with the fetch operation:', error);
      });
  };



  const handleLogout = () => {
    localStorage.removeItem('accesstoken');
    navigate('/');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const blurEmail = (email) => {
    const parts = email.split('@');
    const username = parts[0];
    const domain = parts[1];
    const blurredUsername = username.substring(0, Math.floor(username.length / 2)) + '*'.repeat(username.length - Math.floor(username.length / 2));
    return blurredUsername + '@' + domain;
  };

  const toggleFullEmailVisibility = () => {
    setShowFullEmail(!showFullEmail);
  };

  const removeFromFavorites = (productId) => {
    fetch(`http://127.0.0.1:8000/api/favorite/delete/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('Record deleted successfully');
      handleFavorites();
    })
    .catch(error => {
      console.error('Error deleting record:', error);
    });
  };



  const handleUserOrders = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const userId = userData.id;

    fetch(`http://127.0.0.1:8000/api/getuserorder/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setUserOrders(data);
        console.log('User Orders:', data);
      })
      .catch(error => {
        setError(error.message);
        console.error('Error fetching user orders:', error);
      });
  };

  const handlePlaceOrder = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const userId = userData.id;

    fetch(`http://127.0.0.1:8000/api/order/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Order placed successfully:', data);
      alert('Commande passée avec succès !');
      handleUserOrders();
    })
    .catch(error => {
      console.error('Error placing order:', error);
    });
  };

  const renderUserOrders = () => {
    return (
      <div className="user-orders-section">
        <h2>Historique des Commandes</h2>
        {userOrders.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Identifiant de commande</th>
                <th>Nom du produit</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Prix total</th>
              </tr>
            </thead>
            <tbody>
              {userOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  {order.items && order.items.length > 0 ? (
                    <>
                      <td>{order.items[0].produit.name}</td>
                      <td>{order.items[0].quantity}</td>
                      <td>{order.items[0].produit.prix}</td>
                      <td>{(order.items[0].quantity * order.items[0].produit.prix).toFixed(2)}</td>
                    </>
                  ) : (
                    <td colSpan="5">Aucun article</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucune commande trouvée.</p>
        )}
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="profile-container">
      <nav className="profilenav">
        <img src={logo} alt="Logo" />
        <div>
          <button>Profile</button>
        </div>
        <div>
          <button onClick={handleLogout}>Déconnexion</button>
          <button onClick={handleBackToHome}>Retour à l'accueil</button>
        </div>
      </nav>
      <div className="profile-content">
        <div className="user-info">
          {user && (
            <>
              <h2>Informations de l'utilisateur</h2>
              <div className="form-group">
                <label htmlFor="name">Nom:</label>
                <input type="text" id="name" value={user.name} readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="username">Nom d'utilisateur:</label>
                <input type="text" id="username" value={user.username} readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="text" id="email" value={showFullEmail ? user.email : blurEmail(user.email)} readOnly />
                <button className="toggle-email" onClick={toggleFullEmailVisibility}>
  {showFullEmail ? 'Masquer l\'e-mail' : 'Afficher l\'e-mail'}
</button>
              </div>
            </>
          )}
        </div>
        <div className="favorites-section">
          <h2>Mes Favoris</h2>
          <div className="favorites-container">
            {favorites.produit && favorites.produit.length > 0 ? (
              favorites.produit.map(produit => (
                <div key={produit.id} className="favori-card">
                  <div className="favori-name">{produit.name}</div>
                  {produit.image && (
                    <img src={`http://127.0.0.1:8000/storage/${produit.image}`} alt={produit.name} />
                  )}
                  <p>Prix: {produit.prix}</p>
                  <p>Quantité: {produit.qte}</p>
                  <button onClick={() => removeFromFavorites(produit.id)}>Supprimer des favoris</button>
                </div>
              ))
            ) : (
              <p>Aucun produit dans les favoris.</p>
            )}
          </div>
        </div>
        {renderUserOrders()}
      </div>
    </div>
  );
}

export default Profile;