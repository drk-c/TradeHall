import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showNotification, updateCartCount } = useNotification();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8000/api/products/${id}`);
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
            try {
                const response = await fetch(`http://localhost:8000/api/products/${id}`, {
                    method: 'DELETE',
                });
                
                if (response.ok) {
                    showNotification('Listing deleted successfully!', 'success');
                    navigate('/'); // Redirect to home page
                } else {
                    showNotification('Failed to delete listing', 'error');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                showNotification('Error deleting listing', 'error');
            }
        }
    };

    const handleMarkAsSold = async () => {
        const newSoldStatus = !product.sold;
        const action = newSoldStatus ? 'mark as sold' : 'mark as available';
        
        if (window.confirm(`Are you sure you want to ${action}?`)) {
            try {
                const response = await fetch(`http://localhost:8000/api/products/${id}/sold`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sold: newSoldStatus }),
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data.product);
                    showNotification(data.message, 'success');
                } else {
                    showNotification('Failed to update listing status', 'error');
                }
            } catch (error) {
                console.error('Error updating product status:', error);
                showNotification('Error updating listing status', 'error');
            }
        }
    };

    const handleAddToCart = async () => {
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
                    productId: id, 
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

    if (loading) return <p>Loading product details...</p>;
    if (!product) return <p>Product not found.</p>;

    return (
        <div className="product-details-container">
            <h2 className="page-title">
                {product.name}
                {product.sold && <span className="sold-badge">SOLD</span>}
            </h2>
            <div className="product-details-main">
                <div className="product-images">
                    {product.images.map((src, idx) => (
                        <img key={idx} src={`http://localhost:8000/api/products/image/${id}/${idx}`} alt={`product ${idx+1}`} />
                    ))}
                </div>
                <div className="product-info">
                    <p><strong>Status:</strong> 
                        <span className={`status-text ${product.sold ? 'sold' : 'available'}`}>
                            {product.sold ? 'Sold' : 'Available'}
                        </span>
                    </p>
                    <p><strong>Description:</strong> {product.description}</p>
                    <p><strong>Price:</strong> ${product.price}</p>
                    <p><strong>Category:</strong> {product.category}</p>
                    <p><strong>Meetup Location:</strong> {product.location}</p>
                    <p><strong>Email:</strong> {product.email}</p>
                    {product.phone && <p><strong>Phone:</strong> {product.phone}</p>}
                </div>
            </div>
            <div className="product-actions-bottom">
                {!product.sold && (
                    <button 
                        onClick={handleAddToCart}
                        className="action-btn add-to-cart-btn"
                    >
                        Add to Cart
                    </button>
                )}
                <button 
                    onClick={handleMarkAsSold}
                    className={`action-btn ${product.sold ? 'mark-available-btn' : 'mark-sold-btn'}`}
                >
                    {product.sold ? 'Mark as Available' : 'Mark as Sold'}
                </button>
                <button 
                    onClick={handleDelete}
                    className="action-btn delete-btn"
                >
                    Delete Listing
                </button>
            </div>
        </div>
    );
};

export default ProductDetails;