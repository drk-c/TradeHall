import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
    const { id } = useParams();
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

    if (loading) return <p>Loading product details...</p>;
    if (!product) return <p>Product not found.</p>;

    return (
        <div className="product-details-container">
            <h2 className="page-title">{product.name}</h2>
            <div className="product-details-main">
                <div className="product-images">
                    {product.images.map((src, idx) => (
                        <img key={idx} src={`http://localhost:8000${src}`} alt={`product ${idx+1}`} />
                    ))}
                </div>
                <div className="product-info">
                    <p><strong>Description:</strong> {product.description}</p>
                    <p><strong>Price:</strong> ${product.price}</p>
                    <p><strong>Category:</strong> {product.category}</p>
                    <p><strong>Meetup Location:</strong> {product.location}</p>
                    <p><strong>Email:</strong> {product.email}</p>
                    {product.phone && <p><strong>Phone:</strong> {product.phone}</p>}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;