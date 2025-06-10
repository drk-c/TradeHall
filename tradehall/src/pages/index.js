import React from "react";
import { Link } from 'react-router-dom';
import { productCategories } from '../data/productCategories';
import "./index.css"

const Home = () => {
    // Get a few featured categories to display on the home page
    const featuredCategories = productCategories.slice(0, 4);

    return (
        <>
            <section className="hero">
                <h1>The campus marketplace for everything.</h1>
                <p>Buy & sell textbooks, gadgets, furniture, merch, and more!</p>
                <div className="hero-buttons">
                    <Link className="btn-primary" to="/categories">Browse Categories</Link>
                    <Link className="btn-secondary" to="/sell">Sell an Item</Link>
                </div>
            </section>

            <section id="about" className="home-section">
                <div className="container">
                    <h2>About TradeHall</h2>
                    <p>TradeHall is an exclusive online marketplace for university students. Our mission is to provide a safe, convenient, and reliable platform for students to buy, sell, and trade items within the campus community. From textbooks and electronics to furniture and dorm essentials, find what you need or make some extra cash by selling things you don't.</p>
                </div>
            </section>

            <section id="featured-categories" className="home-section bg-light">
                <div className="container">
                    <h2>Featured Categories</h2>
                    <div className="grid">
                        {featuredCategories.map(category => (
                            <Link key={category.id} to={`/categories/${category.slug}`} className="category-card">
                                <img src={category.image} alt={category.name} />
                                <div className="category-card-name">{category.name}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="home-section">
                <div className="container">
                    <h2>How It Works</h2>
                    <div className="how-it-works-grid">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3>Sign Up</h3>
                            <p>Create an account using your university email to start.</p>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <h3>List or Browse</h3>
                            <p>List your items for sale or browse for items you want to buy.</p>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <h3>Connect & Transact</h3>
                            <p>Connect with other students to arrange meetup and payment.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;