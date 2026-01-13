import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportsAPI } from '../services/api';
import { toast } from 'react-toastify';
import styles from '../styles/ReportPage.module.css';

const ReportPage = () => {
    const [formData, setFormData] = useState({
        location: '',
        waste_type: '',
        description: '',
        image: null
    });
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                image: file
            });
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.location || !formData.waste_type) {
            toast.error('Location and waste type are required');
            return;
        }

        setLoading(true);

        try {
            // Create report data
            const reportData = {
                location: formData.location,
                waste_type: formData.waste_type,
                description: formData.description || null
            };

            const response = await reportsAPI.createReport(reportData);
            
            toast.success('Report submitted successfully! 10 points earned ♻️');
            
            // Reset form
            setFormData({
                location: '',
                waste_type: '',
                description: '',
                image: null
            });
            setImagePreview(null);
            
            // Update dashboard data
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
            
        } catch (error) {
            console.error('Error submitting report:', error);
            const errorMessage = error.response?.data?.error || 'Failed to submit report. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.reportPage}>
            <div className="container">
                <div className={styles.reportContainer}>
                    <h2>Report Plastic Waste</h2>
                    <p className={styles.subtitle}>Help keep your community clean by reporting plastic waste</p>
                    
                    <form onSubmit={handleSubmit} className={styles.reportForm}>
                        <div className={styles.formGroup}>
                            <label>Location *</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Enter location of the waste"
                                required
                                className={styles.formControl}
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Type of Plastic Waste *</label>
                            <select
                                name="waste_type"
                                value={formData.waste_type}
                                onChange={handleChange}
                                required
                                className={styles.formControl}
                            >
                                <option value="">Select waste type</option>
                                <option value="bottles">Plastic bottles</option>
                                <option value="bags">Plastic bags</option>
                                <option value="packaging">Packaging plastics</option>
                                <option value="mixed">Mixed plastic waste</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Description (Optional)</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Additional details about the waste..."
                                rows="4"
                                className={styles.formControl}
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Upload Image (Optional)</label>
                            <input
                                type="file"
                                name="image"
                                onChange={handleImageChange}
                                accept="image/*"
                                className={styles.fileInput}
                            />
                            
                            {imagePreview && (
                                <div className={styles.imagePreview}>
                                    <img src={imagePreview} alt="Preview" />
                                    <button 
                                        type="button" 
                                        className={styles.removeImage}
                                        onClick={() => {
                                            setFormData({...formData, image: null});
                                            setImagePreview(null);
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                            
                            <p className={styles.helperText}>
                                Upload a photo of the waste to help collectors identify it
                            </p>
                        </div>
                        
                        <div className={styles.formFooter}>
                            <button 
                                type="submit" 
                                className={styles.submitButton}
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit Report'}
                            </button>
                            
                            <p className={styles.pointsNote}>
                                <strong>🎯 10 points</strong> will be awarded for each valid report
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReportPage;