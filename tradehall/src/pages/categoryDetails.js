import React from "react";
import { useParams } from "react-router-dom";
import { productCategories } from "../data/productCategories";
import { Link } from 'react-router-dom';
import NotFound from "./notFound";

const CategoryDetails = () => {
    const { slug } = useParams();
    const category = productCategories.find(c => c.slug === slug);

    if (!category) return <NotFound />;

    // dummy items
    const sampleItems = Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        name: `${category.name} Item #${i + 1}`,
        price: (Math.random() * 50 + 10).toFixed(2),
        image: category.image,
    }));

    return (
        <>
            <h2 className="page-title">{category.name}</h2>
            <div className="grid">
                {sampleItems.map(item => (
                <Link key={item.id} to={`/products/${item.id}`} className="card">
                    <img src={item.image} alt={item.name} />
                    <div className="card-overlay">
                    <span className="card-title">{item.name}</span>
                    <span className="card-action">${item.price}</span>
                    </div>
                </Link>
                ))}
            </div>
        </>
    );

    return (
        <>
             <h2 className="page-title">Temp Category Details</h2>
             <p>Temp category details.</p>
        </>
    );
};

export default CategoryDetails;
