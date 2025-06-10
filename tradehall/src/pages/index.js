import React from "react";
import { Link } from 'react-router-dom';
import { productCategories } from "../data/productCategories";
import "./index.css"

const Home = () => {
    const featuredCategories = productCategories.slice(0, 3);

    return (
        <>
            <section className="hero">
                <h1>The campus marketplace for everything.</h1>
                <p>Buy & sell textbooks, gadgets, furniture, merch, and more!</p>
                <Link className="btn-primary" to="/categories">Browse Categories</Link>
            </section>

            <section id="about" className="home-section">
                <h2 className="section-title">About TradeHall</h2>
                <p>TradeHall is an exclusive online marketplace for university students. Our platform makes it easy and safe to buy and sell goods within the campus community. From textbooks and electronics to furniture and dorm essentials, find what you need or sell what you don't!</p>
            </section>

            <section id="featured-categories" className="home-section">
                <h2 className="section-title">Featured Categories</h2>
                <div className="categories-grid">
                    {featuredCategories.map(category => (
                        <div key={category.id} className="category-card">
                            <Link to={`/categories/${category.slug}`}>
                                <img src={category.image} alt={category.name} />
                                <div className="category-name">{category.name}</div>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            <section id="how-it-works" className="home-section">
                <h2 className="section-title">How It Works</h2>
                <div className="how-it-works-grid">
                    <div className="step">
                        <div className="step-icon">1</div>
                        <h3>Create an Account</h3>
                        <p>Sign up with your student email to start browsing or selling in minutes.</p>
                    </div>
                    <div className="step">
                        <div className="step-icon">2</div>
                        <h3>List Your Item</h3>
                        <p>Take a photo, set a price, and describe your item. Posting is free and easy.</p>
                    </div>
                    <div className="step">
                        <div className="step-icon">3</div>
                        <h3>Buy & Sell</h3>
                        <p>Connect with other students on campus to exchange goods and payment securely.</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;