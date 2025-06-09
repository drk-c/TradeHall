import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8000/api/products');
                const data = await response.json();
                setListings(data);
            } catch (error) {
                console.error("Failed to fetch listings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    const addListing = useCallback(async (listingData) => {
        try {
            const response = await fetch('http://localhost:8000/api/products', {
                method: 'POST',
                body: listingData, // FormData, no need for Content-Type header
            });
            const data = await response.json();
            if (data.success) {
                setListings(prev => [...prev, data.product]);
            }
            return data;
        } catch (error) {
            console.error("Failed to add listing:", error);
            return { success: false, message: 'Frontend error' };
        }
    }, []);

    const fetchListingsByCategory = useCallback(async (categoryName) => {
        try {
            const response = await fetch(`http://localhost:8000/api/products/category/${categoryName}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Failed to fetch listings for category ${categoryName}:`, error);
            return [];
        }
    }, []);

    const getListingById = useCallback((id) => {
        return listings.find(listing => listing._id === id);
    }, [listings]);

    const value = {
        listings,
        loading,
        addListing,
        fetchListingsByCategory,
        getListingById
    };

    return (
        <ListingsContext.Provider value={value}>
            {children}
        </ListingsContext.Provider>
    );
}; 