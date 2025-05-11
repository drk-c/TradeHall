import React from "react";
import { useState } from "react";

const Cart = () => {
    const [items] = useState([]); // stub cart state

    return (
        <>
             <h2 className="page-title">Your Cart</h2>
            {items.length === 0 ? <p>Your cart is empty.</p> : <p>Cart items go here.</p>}
        </>
    );
};

export default Cart;

//Testing push