import React, { useState, useEffect, useRef } from 'react';
import './RadiusMap.css';

const RadiusMap = ({ location, radius, onRadiusChange, className }) => {
    const [coordinates, setCoordinates] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const mapRef = useRef();

    const radiusOptions = [
        { value: 1, label: '1 mile' },
        { value: 2, label: '2 miles' },
        { value: 5, label: '5 miles' },
        { value: 10, label: '10 miles' },
        { value: 25, label: '25 miles' }
    ];

    useEffect(() => {
        if (location && location.length > 3) {
            geocodeLocation(location);
        }
    }, [location]);

    const geocodeLocation = async (locationQuery) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}&limit=1&addressdetails=1`
            );
            const data = await response.json();
            
            if (data && data.length > 0) {
                const coords = {
                    lat: parseFloat(data[0].lat),
                    lon: parseFloat(data[0].lon)
                };
                setCoordinates(coords);
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // const getStaticMapUrl = () => {
    //     if (!coordinates) return null;
    //     
    //     // Using a simple static map service
    //     const { lat, lon } = coordinates;
    //     const zoom = getZoomLevel(radius);
    //     
    //     // OpenStreetMap static map (free alternative)
    //     return `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-s-marker+3b82f6(${lon},${lat})/${lon},${lat},${zoom},0/300x200@2x?access_token=pk.eyJ1IjoidHJhZGVoYWxsIiwiYSI6ImNtNjRwYWxtYjAyY3Myc3EzZHFydzBlc2QifQ.placeholder`;
    // };

    // const getZoomLevel = (radiusMiles) => {
    //     // Convert radius to appropriate zoom level
    //     if (radiusMiles <= 1) return 13;
    //     if (radiusMiles <= 2) return 12;
    //     if (radiusMiles <= 5) return 11;
    //     if (radiusMiles <= 10) return 10;
    //     return 9;
    // };

    const handleRadiusChange = (e) => {
        const newRadius = parseInt(e.target.value);
        onRadiusChange(newRadius);
    };

    if (!location) {
        return (
            <div className={`radius-map-container ${className || ''}`}>
                <div className="radius-map-placeholder">
                    <i className="fa-solid fa-location-dot"></i>
                    <span>Enter location to see delivery area</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`radius-map-container ${className || ''}`}>
            <div className="radius-map-header">
                <h4>Meetup Location</h4>
                <div className="radius-selector">
                    <label>Radius: </label>
                    <select value={radius} onChange={handleRadiusChange}>
                        {radiusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div className="radius-map-display">
                {isLoading ? (
                    <div className="map-loading">
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        <span>Loading map...</span>
                    </div>
                ) : coordinates ? (
                    <div className="map-container">
                        <div className="static-map" ref={mapRef}>
                            {/* Simple CSS-based map representation */}
                            <div className="map-background"></div>
                            <div className="location-marker">
                                <i className="fa-solid fa-location-dot"></i>
                            </div>
                            <div 
                                className="radius-circle" 
                                style={{
                                    width: `${Math.min(radius * 20, 160)}px`,
                                    height: `${Math.min(radius * 20, 160)}px`
                                }}
                            ></div>
                            <div className="map-overlay">
                                <div className="location-name">{location}</div>
                                <div className="radius-info">{radius} mile{radius !== 1 ? 's' : ''} radius</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="map-error">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <span>Unable to load map for this location</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RadiusMap; 