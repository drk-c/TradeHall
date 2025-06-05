import React, { createContext, useContext, useState } from 'react';

const ListingsContext = createContext();

export const useListings = () => {
    const context = useContext(ListingsContext);
    if (!context) {
        throw new Error('useListings must be used within a ListingsProvider');
    }
    return context;
};

export const ListingsProvider = ({ children }) => {
    const [listings, setListings] = useState([]);

    const addListing = (listing) => {
        const newListing = {
            ...listing,
            id: Date.now(), // Simple ID generation
            createdAt: new Date().toISOString()
        };
        setListings(prev => [...prev, newListing]);
        return newListing;
    };

    const getListingsByCategory = (categoryName) => {
        return listings.filter(listing => listing.category === categoryName);
    };

    const getListingById = (id) => {
        return listings.find(listing => listing.id === parseInt(id));
    };

    const value = {
        listings,
        addListing,
        getListingsByCategory,
        getListingById
    };

    return (
        <ListingsContext.Provider value={value}>
            {children}
        </ListingsContext.Provider>
    );
}; 