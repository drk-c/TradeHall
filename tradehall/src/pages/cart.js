import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNotification } from '../contexts/NotificationContext';
import './cart.css';

const Cart = () => {
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { updateCartCount } = useNotification();

    useEffect(() => {
        checkAuthAndFetchCart();
    }, []);

    const checkAuthAndFetchCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoggedIn(false);
            setLoading(false);
            return;
        }

        try {
            // Verify token is valid
            const authResponse = await fetch('http://localhost:8000/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!authResponse.ok) {
                localStorage.removeItem('token');
                setIsLoggedIn(false);
                setLoading(false);
                return;
            }

            setIsLoggedIn(true);
            await fetchCart();
        } catch (error) {
            console.error('Auth check failed:', error);
            setIsLoggedIn(false);
            setLoading(false);
        }
    };

    const fetchCart = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:8000/api/cart', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const cartData = await response.json();
                setCart(cartData);
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) {
            await removeItem(productId);
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8000/api/cart/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ quantity })
            });

            if (response.ok) {
                await fetchCart();
                updateCartCount(); // Update cart count after quantity change
            }
        } catch (error) {
            console.error('Failed to update quantity:', error);
        }
    };

    const removeItem = async (productId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8000/api/cart/${productId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                await fetchCart();
                updateCartCount(); // Update cart count after item removal
            }
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    const calculateTotal = () => {
        return cart.items.reduce((total, item) => {
            return total + (item.productId?.price || 0) * item.quantity;
        }, 0).toFixed(2);
    };

    if (loading) return <div className="cart-loading">Loading your cart...</div>;

    if (!isLoggedIn) {
        return (
            <div className="cart-container">
                <h2 className="page-title">Your Cart</h2>
                <div className="cart-login-prompt">
                    <p>Please log in to view your cart.</p>
                    <Link to="/login" className="login-link">Log In</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h2 className="page-title">Your Cart</h2>
            
            {cart.items.length === 0 ? (
                <div className="cart-empty">
                    <p>Your cart is empty.</p>
                    <Link to="/categories" className="continue-shopping">Continue Shopping</Link>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {cart.items.map((item) => (
                            <div key={item.productId?._id} className="cart-item">
                                <div className="item-image">
                                    <img 
                                        src={item.productId?.images?.[0] ? `http://localhost:8000${item.productId.images[0]}` : '/placeholder.jpg'} 
                                        alt={item.productId?.name || 'Product'} 
                                    />
                                </div>
                                <div className="item-details">
                                    <h3>{item.productId?.name || 'Unknown Product'}</h3>
                                    <p className="item-price">${item.productId?.price || 0}</p>
                                    <p className="item-location">{item.productId?.location}</p>
                                    {item.productId?.sold && <span className="sold-indicator">SOLD</span>}
                                </div>
                                <div className="item-controls">
                                    <div className="quantity-controls">
                                        <button 
                                            onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                                            className="quantity-btn"
                                        >
                                            -
                                        </button>
                                        <span className="quantity">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                                            className="quantity-btn"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => removeItem(item.productId._id)}
                                        className="remove-btn"
                                    >
                                        Remove
                                    </button>
                                </div>
                                <div className="item-total">
                                    ${((item.productId?.price || 0) * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="cart-summary">
                        <div className="summary-row">
                            <span>Total ({cart.items.length} items):</span>
                            <span className="total-price">${calculateTotal()}</span>
                        </div>
                        <button className="checkout-btn">Proceed to Checkout</button>
                        <Link to="/categories" className="continue-shopping">Continue Shopping</Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;