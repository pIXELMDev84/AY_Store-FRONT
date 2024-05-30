import React, { useEffect, useState } from 'react';
import './checkout.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accesstoken');
    if (!accessToken) {
      navigate('/login');
    } else {
      fetchUser();
      handleCart();
    }
  }, [navigate]);

  const fetchUser = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  };

  const handleCart = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const userId = userData.id;

    fetch(`http://127.0.0.1:8000/api/panier/index/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setCart(data);
        setLoading(false);
        console.log('Cart:', data);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      newQuantity = 1;
    }
    const updatedCart = cart.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const removeFromCart = (productId) => {
    fetch(`http://127.0.0.1:8000/api/panier/delete/${productId}`, {
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
        handleCart();
      })
      .catch(error => {
        console.error('Error deleting record:', error);
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
      body: JSON.stringify({ user_id: userId, items: cart }),
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
        handleCart();
        navigate('/confirmation');
      })
      .catch(error => {
        console.error('Error placing order:', error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="checkout-container">
      <h2>Finaliser ma commande</h2>
      <div className="cart-section">
        <h2>Mon Panier</h2>
        {cart && cart.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Prix</th>
                <th>Quantité</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>{item.produit.name}</td>
                  <td>{item.produit.prix} DA</td>
                  <td>
                    <div className="quantity-container">
                      <button className="quantity-button" onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}>-</button>
                      <span className="quantity">{item.quantity}</span>
                      <button className="quantity-button" onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </td>
                  <td>{(item.quantity * item.produit.prix).toFixed(2)} DA</td>
                  <td>
                    <button className="delete-button" onClick={() => removeFromCart(item.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Votre panier est vide.</p>
        )}
        {cart.length > 0 && (
          <button onClick={handlePlaceOrder} className="place-order-button">Passer commande</button>
        )}
        <div className="back-to-home">
          <button onClick={() => navigate('/')} className="place-order-button"><FontAwesomeIcon icon={faHome} /> Retour à l'accueil</button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
