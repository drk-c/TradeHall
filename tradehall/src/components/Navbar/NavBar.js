import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function Navbar() {
    return (
        <header className="navbar">
            <div className="container">
                <Link to="/" className="logo">TradeHall</Link>

                <nav className="other-nav">
                    <Link to="/categories">Categories</Link>
                    <Link to="/products">Products</Link>
                    <Link to="/cart">Cart</Link>
                </nav>

                <Link to="/login" className="login-button">Login</Link>
            </div>
        </header>
    );
};

export default Navbar;