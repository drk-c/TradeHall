import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import Login from "../LoginButton/LoginButton.js";
import ProfileButton from '../ProfileButton/ProfileButton.js';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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
            await axios.get('http://:8000/profile', {
              headers: { Authorization: `Bearer ${token}` }
            });
            setIsLoggedIn(true);
          } catch (err) {
            setIsLoggedIn(false);
            console.log("invalid token");
          }
        };
      
        checkAuth();
    }, [location]); // triggers useEffect whenever route changes

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
                    <Link to="/cart">Cart</Link>
                    {isLoggedIn ? <ProfileButton /> : <Login />}
                </nav>
                
            </div>
        </header>
    );
}

export default Navbar;