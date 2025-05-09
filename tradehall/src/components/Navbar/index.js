import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
                <Link className="nav-link" to="/">Home</Link>
                <Link className="nav-link" to="/categories">Categories</Link>
                <Link className="nav-link" to="/products">Products</Link>
                <Link className="nav-link" to="/cart">Cart</Link>
        </nav>
    );
};

export default Navbar;