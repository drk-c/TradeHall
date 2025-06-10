import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { productCategories } from "../data/productCategories";
import { useListings } from "../contexts/ListingsContext";
import { useNotification } from "../contexts/NotificationContext";
import { Link } from 'react-router-dom';
import NotFound from "./notFound";

const CategoryDetails = () => {
    const { slug } = useParams();
    const { fetchListingsByCategory } = useListings();
    const { showNotification, updateCartCount } = useNotification();
    const [categoryItems, setCategoryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const category = productCategories.find(c => c.slug === slug);

    useEffect(() => {
        if (category) {
            const loadListings = async () => {
                setLoading(true);
                const items = await fetchListingsByCategory(category.name);
                setCategoryItems(items);
                setLoading(false);
            };
            loadListings();
        } else {
            setLoading(false);
        }
    }, [slug, category, fetchListingsByCategory]);

    const handleQuickAddToCart = async (productId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('Please log in to add items to your cart.', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    productId: productId, 
                    quantity: 1 
                })
            });

            if (response.ok) {
                showNotification('Item added to cart!', 'success');
                updateCartCount(); // Update cart count after adding item
            } else if (response.status === 401) {
                localStorage.removeItem('token');
                showNotification('Please log in to add items to your cart.', 'error');
            } else {
                showNotification('Failed to add item to cart.', 'error');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            showNotification('Error adding item to cart.', 'error');
        }
    };

    if (!category) return <NotFound />;
    if (loading) return <p>Loading...</p>;

    return (
        <>
            <h2 className="page-title">{category.name}</h2>
            {categoryItems.length === 0 ? (
                <p style={{ textAlign: 'center', marginTop: '2rem' }}>
                    No items in this category yet. <Link to="/products">Be the first to sell something!</Link>
                </p>
            ) : (
                <div className="grid">
                    {categoryItems.map(item => (
                    <div key={item._id} className={`card ${item.sold ? 'sold-item' : ''}`}>
                        <Link to={`/products/${item._id}`} className="card-link">
                            <img src={item.images?.[0] ? `http://localhost:8000/api/products/image/${item._id}/0` : category.image} alt={item.name} />
                            <div className="card-overlay">
                            <span className="card-title">
                                {item.name}
                                {item.sold && <span className="sold-tag">SOLD</span>}
                            </span>
                            <span className="card-action">${item.price}</span>
                            </div>
                        </Link>
                        {!item.sold && (
                            <button 
                                className="quick-add-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleQuickAddToCart(item._id);
                                }}
                            >
                                + Cart
                            </button>
                        )}
                    </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default CategoryDetails;
