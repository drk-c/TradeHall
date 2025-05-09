import React from "react";
import { Link } from 'react-router-dom';
import { productCategories } from "../data/productCategories";

const Categories = () => {

    return (
        <>
            <h2 className="page-title">Browse Categories</h2>

            <div className="grid">
            {productCategories.map(cat => (
                <Link key={cat.id} className="card" to={`/categories/${cat.slug}`}>
                    <img src={cat.image} alt={cat.name} />
                    <div className="card-overlay">
                        <span className="card-title">{cat.name}</span>
                        <span className="card-action">Browse Items →</span>
                    </div>
                </Link>
            ))}
            </div>
        </>
    );
};

export default Categories;