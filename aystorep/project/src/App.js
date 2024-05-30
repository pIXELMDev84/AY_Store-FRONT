import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Acceuil from './composant/Acceuil';
import LoginForm from './composant/Loginform';
import RegisterForm from './composant/RegisterForm';
import Profile from './composant/Profile' ;
import Produit from './composant/Produit' ;
import Checkout from './composant/Checkout';
import NouveauxProduits from './composant/NouveauxProduits';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Acceuil/>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/produit" element={<Produit/>} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/produit/new" element={<NouveauxProduits />} />      
      </Routes>
    </Router>
  );
}

export default App;

