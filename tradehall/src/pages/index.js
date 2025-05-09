import React from "react";
import { Link } from 'react-router-dom';

const Home = () => {
    return (
            <section className="hero">
                <h1>The campus marketplace for everything.</h1>
                <p>Buy & sell textbooks, gadgets, furniture, merch, and more!</p>
                <Link className="btn-primary" to="/categories">Browse Categories</Link>
            </section>
    );
};

export default Home;