import React from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
    const { id } = useParams();

    return (
        <>
            <h2 className="page-title">Product #{id}</h2>
            <p>Replace with product details.</p>
        </>
    );
};

export default ProductDetails;