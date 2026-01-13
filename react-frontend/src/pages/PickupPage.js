import React, { useState, useEffect } from 'react';
import { pickupsAPI } from '../services/api';
import { toast } from 'react-toastify';
import styles from '../styles/PickupPage.module.css';

const PickupPage = () => {
    const [formData, setFormData] = useState({
        pickup_date: '',
        pickup_time: '',
        address: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [myPickups, setMyPickups] = useState([]);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        loadMyPickups();
    }, []);

    const loadMyPickups = async () => {
        try {
            const response = await pickupsAPI.getMyPickups();
            setMyPickups(response.data || []);
        } catch (error) {
            console.error('Error loading pickups:', error);
            toast.error('Failed to load pickup history');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.pickup_date || !formData.pickup_time || !formData.address) {
            toast.error('Pickup date, time and address are required');
            return;
        }

        setLoading(true);

        try {
            await pickupsAPI.schedulePickup(formData);
            
            toast.success('Pickup scheduled successfully!');
            
            // Reset form
            setFormData({
                pickup_date: '',
                pickup_time: '',
                address: '',
                notes: ''
            });
            
            // Refresh pickup list
            loadMyPickups();
            
        } catch (error) {
            console.error('Error scheduling pickup:', error);
            const errorMessage = error.response?.data?.error || 'Failed to schedule pickup. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Calculate stats for tabs
    const allPickups = myPickups.length;
    const pendingPickups = myPickups.filter(p => p.status === 'pending').length;
    const collectedPickups = myPickups.filter(p => p.status === 'collected' || p.status === 'completed').length;
    const cancelledPickups = myPickups.filter(p => p.status === 'cancelled').length;

    // Filter pickups based on active tab
    const filteredPickups = myPickups.filter(pickup => {
        if (activeTab === 'all') return true;
        if (activeTab === 'pending') return pickup.status === 'pending';
        if (activeTab === 'collected') return pickup.status === 'collected' || pickup.status === 'completed';
        if (activeTab === 'cancelled') return pickup.status === 'cancelled';
        return true;
    });

    // Calculate total points
    const totalPoints = myPickups.reduce((sum, pickup) => sum + (pickup.points_earned || 0), 0);

    const getStatusClass = (status) => {
        switch (status) {
            case 'collected':
            case 'completed':
                return styles.collected;
            case 'pending':
                return styles.pending;
            case 'cancelled':
                return styles.cancelled;
            default:
                return '';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'collected':
            case 'completed':
                return '✔ Collected';
            case 'pending':
                return '⏳ Pending';
            case 'cancelled':
                return '❌ Cancelled';
            default:
                return status;
        }
    };

    return (
        <div className={styles.pickupPage}>
            <div className="container">
                <div className={styles.pickupLayout}>
                    {/* Left Form Section */}
                    <div className={styles.formSection}>
                        <div className={styles.formCard}>
                            <h2>Schedule Waste Pickup</h2>
                            <p className={styles.subtitle}>Book a convenient time for waste collection</p>
                            
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroup}>
                                    <label>Pickup Date *</label>
                                    <input
                                        type="date"
                                        name="pickup_date"
                                        value={formData.pickup_date}
                                        onChange={handleChange}
                                        required
                                        className={styles.formControl}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                
                                <div className={styles.formGroup}>
                                    <label>Pickup Time *</label>
                                    <input
                                        type="time"
                                        name="pickup_time"
                                        value={formData.pickup_time}
                                        onChange={handleChange}
                                        required
                                        className={styles.formControl}
                                    />
                                </div>
                                
                                <div className={styles.formGroup}>
                                    <label>Pickup Address *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter your complete address"
                                        required
                                        className={styles.formControl}
                                    />
                                </div>
                                
                                <div className={styles.formGroup}>
                                    <label>Additional Notes (Optional)</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        placeholder="Any special instructions for the collector..."
                                        rows="3"
                                        className={styles.formControl}
                                    />
                                </div>
                                
                                <div className={styles.infoBox}>
                                    <p>📋 <strong>Pickup Guidelines:</strong></p>
                                    <ul>
                                        <li>Ensure waste is properly segregated</li>
                                        <li>Keep waste in visible location</li>
                                        <li>Collector will arrive within 30-minute window</li>
                                    </ul>
                                </div>
                                
                                <button 
                                    type="submit" 
                                    className={styles.submitButton}
                                    disabled={loading}
                                >
                                    {loading ? 'Scheduling...' : '✔ Schedule Pickup'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right History Section */}
                    <div className={styles.historySection}>
                        <div className={styles.historyHeader}>
                            <div>
                                <h3>Waste Collection History</h3>
                                <p>Track your submissions and impact</p>
                            </div>
                            <div className={styles.pointsDisplay}>
                                <h1>{totalPoints}</h1>
                                <p>Total Points</p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className={styles.tabs}>
                            <button 
                                className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
                                onClick={() => setActiveTab('all')}
                            >
                                All ({allPickups})
                            </button>
                            <button 
                                className={`${styles.tab} ${activeTab === 'pending' ? styles.active : ''}`}
                                onClick={() => setActiveTab('pending')}
                            >
                                Pending ({pendingPickups})
                            </button>
                            <button 
                                className={`${styles.tab} ${activeTab === 'collected' ? styles.active : ''}`}
                                onClick={() => setActiveTab('collected')}
                            >
                                Collected ({collectedPickups})
                            </button>
                            <button 
                                className={`${styles.tab} ${activeTab === 'cancelled' ? styles.active : ''}`}
                                onClick={() => setActiveTab('cancelled')}
                            >
                                Cancelled ({cancelledPickups})
                            </button>
                        </div>

                        {/* Pickup List */}
                        <div className={styles.pickupList}>
                            {filteredPickups.length > 0 ? (
                                filteredPickups.map((pickup) => (
                                    <div key={pickup.id} className={styles.pickupCard}>
                                        <div className={styles.pickupHeader}>
                                            <h3>Plastic Waste Pickup</h3>
                                            <span className={`${styles.status} ${getStatusClass(pickup.status)}`}>
                                                {getStatusText(pickup.status)}
                                            </span>
                                        </div>
                                        
                                        <div className={styles.pickupDetails}>
                                            <p><strong>Confirmation:</strong> WC{pickup.id.toString().padStart(8, '0')}</p>
                                            <p>📅 <strong>Pickup Date:</strong> {pickup.pickup_date} — 🕒 {pickup.pickup_time}</p>
                                            <p>📌 <strong>Address:</strong> {pickup.address}</p>
                                            {pickup.notes && (
                                                <p>📝 <strong>Notes:</strong> {pickup.notes}</p>
                                            )}
                                            {pickup.created_at && (
                                                <p>🗓️ <strong>Scheduled:</strong> {new Date(pickup.created_at).toLocaleDateString()}</p>
                                            )}
                                        </div>
                                        
                                        {pickup.points_earned > 0 && (
                                            <div className={styles.pointsBadge}>
                                                +{pickup.points_earned} points
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className={styles.emptyState}>
                                    <p>No pickup requests found for this category.</p>
                                    <p>Schedule your first pickup using the form!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PickupPage;