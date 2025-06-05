import React from "react";
import { useParams } from "react-router-dom";
import { useListings } from "../contexts/ListingsContext";

const dummyProduct = {
    title: "Sample Textbook",
    description: "A great textbook for your course.",
    price: "25.00",
    category: "Textbooks",
    location: "Campus Library",
    email: "email@example.com",
    images: [
        "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=400&q=60"
    ]
};

const ProductDetails = () => {
    const { id } = useParams();
    const { getListingById } = useListings();
    
    // Try to get real listing first, fall back to dummy
    const product = getListingById(id) || dummyProduct;

    return (
        <div className="product-details-container">
            <h2 className="page-title">{product.title}</h2>
            <div className="product-details-main">
                <div className="product-images">
                    {product.images.map((src, idx) => (
                        <img key={idx} src={src} alt={`product ${idx+1}`} style={{ maxWidth: 200, maxHeight: 200, marginRight: 8 }} />
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