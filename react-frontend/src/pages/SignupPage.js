import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import styles from '../styles/SignupPage.module.css';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        phone: '',
        role: 'citizen' // Backend expects 'citizen', we'll map later
    });
    const [loading, setLoading] = useState(false);
    
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.full_name || !formData.email || !formData.password || !formData.role) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        // Map frontend role selection to backend values
        const backendRole = formData.role;
        
        const signupData = {
            ...formData,
            role: backendRole
        };

        const result = await signup(signupData);
        
        setLoading(false);
        
        if (result.success) {
            toast.success('Account created successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className={styles.signupPage}>
            <div className={styles.signupContainer}>
                <h2>Create Account</h2>
                <p className={styles.subtitle}>Join Plastic Waste Management System</p>
                
                <form onSubmit={handleSubmit} className={styles.signupForm}>
                    <div className={styles.formGroup}>
                        <label>Select Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className={styles.formControl}
                        >
                            <option value="citizen">Reporter</option>
                            <option value="collector">Collector</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                            className={styles.formControl}
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                            className={styles.formControl}
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Create a password (min. 6 characters)"
                            className={styles.formControl}
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Phone Number (Optional)</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            className={styles.formControl}
                        />
                    </div>
                    
                    <div className={styles.formOptions}>
                        <label className={styles.checkboxLabel}>
                            <input type="checkbox" name="remember" required />
                            <span>I agree to the Terms of Service and Privacy Policy</span>
                        </label>
                    </div>
                    
                    <button 
                        type="submit" 
                        className={styles.signupButton}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                
                <div className={styles.signupFooter}>
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className={styles.link}>
                            Login
                        </Link>
                    </p>
                    <p>
                        <Link to="/" className={styles.link}>
                            Back to Home
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;