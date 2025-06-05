import React, { useState, useRef } from "react";
import './sell.css';
import { productCategories } from '../data/productCategories';
import { useListings } from '../contexts/ListingsContext';

const MAX_IMAGES = 10;

const Sell = () => {
    const { addListing } = useListings();
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        category: productCategories[0]?.name || '',
        location: '',
        email: '',
        phone: '',
        images: []
    });
    const [imagePreviews, setImagePreviews] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [touched, setTouched] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const fileInputRef = useRef();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setTouched({ ...touched, [e.target.name]: true });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files).slice(0, MAX_IMAGES);
        setForm({ ...form, images: files });
        setImagePreviews(files.map(file => URL.createObjectURL(file)));
        setTouched({ ...touched, images: true });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragActive(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')).slice(0, MAX_IMAGES);
        setForm({ ...form, images: files });
        setImagePreviews(files.map(file => URL.createObjectURL(file)));
        setTouched({ ...touched, images: true });
    };
    const handleBoxClick = () => {
        fileInputRef.current.click();
    };

    const isInvalid = (field) => {
        if (!submitted && !touched[field]) return false;
        if (field === 'images') return form.images.length === 0;
        return !form[field];
    };

    const handleBlur = (e) => {
        setTouched({ ...touched, [e.target.name]: true });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        // Check for any missing required fields
        if (!form.title || !form.description || !form.price || !form.category || !form.location || !form.email || form.images.length === 0) {
            return;
        }
        
        // Convert images to URLs for storage (in real app, you'd upload to a server)
        const imageUrls = imagePreviews.slice(); // Use the preview URLs for now
        
        // Add the listing to the global state
        const newListing = addListing({
            ...form,
            images: imageUrls
        });
        
        // Reset form
        setForm({
            title: '',
            description: '',
            price: '',
            category: productCategories[0]?.name || '',
            location: '',
            email: '',
            phone: '',
            images: []
        });
        setImagePreviews([]);
        setTouched({});
        setSubmitted(false);
        
        alert(`Listing "${newListing.title}" submitted successfully!`);
    };

    return (
        <div className="sell-container sell-style">
            <h2 className="page-title">Sell an Item</h2>
            <form className="sell-form sell-form" onSubmit={handleSubmit}>
                <div className="photo-upload-section">
                    <div className="photo-upload-label">Photos · {form.images.length} / {MAX_IMAGES}</div>
                    <div
                        className={`photo-dropzone${dragActive ? ' drag-active' : ''}${isInvalid('images') ? ' invalid' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleBoxClick}
                    >
                        <div className="photo-dropzone-content">
                            <span className="photo-icon"><i className="fa-solid fa-image"></i></span>
                            <div className="photo-dropzone-text">
                                <span className="add-photos-text">Add photos</span>
                                <span className="or-drag-text">or drag and drop</span>
                            </div>
                        </div>
                        <input
                            type="file"
                            name="images"
                            accept="image/*"
                            multiple
                            required
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className="image-previews-grid">
                        {imagePreviews.map((src, idx) => (
                            <img key={idx} src={src} alt={`preview ${idx+1}`} />
                        ))}
                    </div>
                </div>
                <div className="form-row">
                    <label>
                        Title
                        <input type="text" name="title" value={form.title} onChange={handleChange} onBlur={handleBlur} required className={isInvalid('title') ? 'invalid' : ''} />
                    </label>
                    <label>
                        Price ($)
                        <input type="number" name="price" value={form.price} onChange={handleChange} onBlur={handleBlur} min="0" step="0.01" required className={isInvalid('price') ? 'invalid' : ''} />
                    </label>
                </div>
                <div className="form-row">
                    <label>
                        Category
                        <select name="category" value={form.category} onChange={handleChange} onBlur={handleBlur} required className={isInvalid('category') ? 'invalid' : ''}>
                            {productCategories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Meetup Location
                        <input type="text" name="location" value={form.location} onChange={handleChange} onBlur={handleBlur} required className={isInvalid('location') ? 'invalid' : ''} />
                    </label>
                </div>
                <div className="form-row">
                    <label className="full-width">
                        Description
                        <textarea name="description" value={form.description} onChange={handleChange} onBlur={handleBlur} required rows={4} className={isInvalid('description') ? 'invalid' : ''} />
                    </label>
                </div>
                <div className="form-row">
                    <label className="full-width">
                        Email
                        <input type="email" name="email" value={form.email} onChange={handleChange} onBlur={handleBlur} required className={isInvalid('email') ? 'invalid' : ''} />
                    </label>
                </div>
                <div className="form-row">
                    <label className="full-width">
                        Phone Number (optional)
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} onBlur={handleBlur} />
                    </label>
                </div>
                <button type="submit" className="submit-btn">Submit Listing</button>
            </form>
        </div>
    );
};

export default Sell;