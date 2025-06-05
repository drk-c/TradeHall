import React from "react";
import { useParams } from "react-router-dom";
import { productCategories } from "../data/productCategories";
import { useListings } from "../contexts/ListingsContext";
import { Link } from 'react-router-dom';
import NotFound from "./notFound";

const CategoryDetails = () => {
    const { slug } = useParams();
    const { getListingsByCategory } = useListings();
    const category = productCategories.find(c => c.slug === slug);

    if (!category) return <NotFound />;

    // Get real listings for this category
    const realListings = getListingsByCategory(category.name);

    // dummy items (keeping a few for demonstration)
    const sampleItems = Array.from({ length: 3 }).map((_, i) => ({
        id: `sample-${i}`,
        title: `${category.name} Item #${i + 1}`,
        price: (Math.random() * 50 + 10).toFixed(2),
        images: [category.image],
        category: category.name,
        description: `Sample ${category.name.toLowerCase()} item`,
        location: "Campus",
        email: "sample@example.com"
    }));

    // Combine real listings and sample items
    const allItems = [...realListings, ...sampleItems];

    return (
        <>
            <h2 className="page-title">{category.name}</h2>
            {allItems.length === 0 ? (
                <p style={{ textAlign: 'center', marginTop: '2rem' }}>
                    No items in this category yet. <Link to="/products">Be the first to sell something!</Link>
                </p>
            ) : (
                <div className="grid">
                    {allItems.map(item => (
                    <Link key={item.id} to={`/products/${item.id}`} className="card">
                        <img src={item.images?.[0] || category.image} alt={item.title} />
                        <div className="card-overlay">
                        <span className="card-title">{item.title}</span>
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
