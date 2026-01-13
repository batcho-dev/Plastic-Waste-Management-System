import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import styles from '../styles/LoginPage.module.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'reporter'
    });
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.email || !formData.password || !formData.role) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);

        // Map 'reporter' to 'citizen' for backend
        const backendRole = formData.role === 'reporter' ? 'citizen' : formData.role;
        
        const result = await login(formData.email, formData.password, backendRole);
        
        setLoading(false);
        
        if (result.success) {
            toast.success('Login successful!');
            navigate('/dashboard');
        } else {
            // Replace 'citizen' with 'reporter' in error messages
            const userFriendlyError = result.error.replace('citizen', 'reporter');
            toast.error(userFriendlyError);
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginContainer}>
                <h2>Login to Plastic Waste Management System</h2>
                
                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div className={styles.formGroup}>
                        <label>Select Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className={styles.formControl}
                        >
                            <option value="">Select Role</option>
                            <option value="reporter">Reporter</option>
                            <option value="collector">Collector</option>
                            <option value="admin">Admin</option>
                        </select>
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
                            placeholder="Enter your password"
                            className={styles.formControl}
                        />
                    </div>
                    
                    <div className={styles.formOptions}>
                        <label className={styles.checkboxLabel}>
                            <input type="checkbox" name="remember" />
                            <span>Remember me</span>
                        </label>
                        
                        <Link to="/forgot-password" className={styles.forgotLink}>
                            Forgot Password?
                        </Link>
                    </div>
                    
                    <button 
                        type="submit" 
                        className={styles.loginButton}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
                <div className={styles.loginFooter}>
                    <p>
                        Don't have an account?{' '}
                        <Link to="/signup" className={styles.link}>
                            Sign Up
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

export default LoginPage;