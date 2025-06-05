import React, { useState, useEffect, useRef } from 'react';
import './LocationInput.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidHJhZGVoYWxsIiwiYSI6ImNtNjRwYWxtYjAyY3Myc3EzZHFydzBlc2QifQ.placeholder'; // Replace with your token

const LocationInput = ({ value, onChange, onBlur, className, required }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef();
    const suggestionsRef = useRef();

    const fetchSuggestions = async (query) => {
        if (!query || query.length < 3) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            // Using a free geocoding service (nominatim) as fallback
            // Replace with Mapbox API when you have a token
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
            );
            const data = await response.json();
            
            const formattedSuggestions = data.map(item => ({
                id: item.place_id,
                address: item.display_name,
                shortAddress: `${item.address?.city || item.address?.town || item.address?.village || ''}, ${item.address?.state || item.address?.country || ''}`.replace(/^, /, ''),
                coordinates: [parseFloat(item.lon), parseFloat(item.lat)]
            }));
            
            setSuggestions(formattedSuggestions);
        } catch (error) {
            console.error('Location API error:', error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (value) {
                fetchSuggestions(value);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [value]);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        onChange({ target: { name: 'location', value: newValue } });
        setShowSuggestions(true);
        setSelectedIndex(-1);
    };

    const handleSuggestionClick = (suggestion) => {
        onChange({ target: { name: 'location', value: suggestion.shortAddress } });
        setShowSuggestions(false);
        setSuggestions([]);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev < suggestions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev > 0 ? prev - 1 : suggestions.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                    handleSuggestionClick(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setSelectedIndex(-1);
                break;
        }
    };

    const handleBlur = (e) => {
        // Delay hiding suggestions to allow for clicks
        setTimeout(() => {
            setShowSuggestions(false);
            setSelectedIndex(-1);
            if (onBlur) onBlur(e);
        }, 150);
    };

    const handleFocus = () => {
        if (value && suggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    return (
        <div className="location-input-container">
            <div className="location-input-wrapper">
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    placeholder="Enter meetup location (e.g., Campus Library, Berkeley, CA)"
                    className={`location-input ${className || ''}`}
                    required={required}
                />
                <div className="location-input-icons">
                    {isLoading && (
                        <div className="location-loading">
                            <i className="fa-solid fa-spinner fa-spin"></i>
                        </div>
                    )}
                    <div className="location-icon">
                        <i className="fa-solid fa-location-dot"></i>
                    </div>
                </div>
            </div>
            
            {showSuggestions && suggestions.length > 0 && (
                <div className="location-suggestions" ref={suggestionsRef}>
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={suggestion.id}
                            className={`location-suggestion ${index === selectedIndex ? 'selected' : ''}`}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            <div className="suggestion-icon">
                                <i className="fa-solid fa-location-dot"></i>
                            </div>
                            <div className="suggestion-content">
                                <div className="suggestion-main">{suggestion.shortAddress}</div>
                                <div className="suggestion-full">{suggestion.address}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LocationInput; 