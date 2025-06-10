import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { productCategories } from "../data/productCategories";
import { useListings } from "../contexts/ListingsContext";
import { Link } from 'react-router-dom';
import NotFound from "./notFound";

const CategoryDetails = () => {
    const { slug } = useParams();
    const { fetchListingsByCategory } = useListings();
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
                    <Link key={item._id} to={`/products/${item._id}`} className="card">
                        <img src={item.images?.[0] ? `http://localhost:8000/api/products/image/${item._id}/0` : category.image} alt={item.name} />
                        <div className="card-overlay">
                        <span className="card-title">{item.name}</span>
                        <span className="card-action">${item.price}</span>
                        </div>
                    </Link>
                    ))}
                </div>
            )}
        </>
    );
};

export default CategoryDetails;
