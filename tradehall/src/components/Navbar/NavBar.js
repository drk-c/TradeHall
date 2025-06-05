import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import Login from "../LoginButton/LoginButton.js";

function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');

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
                </nav>
                <Login />
            </div>
        </header>
    );
}

export default Navbar;