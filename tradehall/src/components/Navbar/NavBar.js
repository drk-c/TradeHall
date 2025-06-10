import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import Login from "../LoginButton/LoginButton.js";
import ProfileButton from '../ProfileButton/ProfileButton.js';
import { useNotification } from '../../contexts/NotificationContext';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { cartCount, updateCartCount } = useNotification();
    const location = useLocation(); // this will re-render the component on every route change

    useEffect(() => {
        const checkAuth = async () => {
          const token = localStorage.getItem('token');
          if (!token) {
            setIsLoggedIn(false);
            console.log("no token");
            return;
          }
      
          try {
            await axios.get('http://localhost:8000/profile', {
              headers: { Authorization: `Bearer ${token}` }
            });
            setIsLoggedIn(true);
            updateCartCount(); // Update cart count when user is logged in
          } catch (err) {
            setIsLoggedIn(false);
            console.log("invalid token");
          }
        };
      
        checkAuth();
    }, [location, updateCartCount]); // triggers useEffect whenever route changes

    const handleSearch = (e) => {
        e.preventDefault();
        // Placeholder for future search functionality
        console.log('Searching for:', searchQuery);
    };

    return (
        <header className="navbar">
            <div className="container">
                <Link to="/" className="logo">TradeHall</Link>

                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="search-btn">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </form>

                <nav className="other-nav">
                    <Link to="/products">Sell</Link>
                    <Link to="/categories">Categories</Link>
                    <Link to="/cart" className="cart-link">
                        Cart
                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </Link>
                    {isLoggedIn ? <ProfileButton /> : <Login />}
                </nav>
                
            </div>
        </header>
    );
}

export default Navbar;