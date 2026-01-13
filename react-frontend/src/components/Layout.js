import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/global.css';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="app-container">
            {/* Header/Navbar */}
            <header className="navbar">
                <div className="container">
                    <div className="navbar-content">
                        <div className="logo">
                            <img 
                                src="https://cdn-icons-png.flaticon.com/512/2909/2909763.png" 
                                alt="PWMS Logo" 
                                style={{ width: '40px', marginRight: '10px' }}
                            />
                            <h2>PWMS</h2>
                        </div>
                        
                        <nav className="nav-links">
                            <Link to="/">Home</Link>
                            {user && (
                                <>
                                    <Link to="/dashboard">Dashboard</Link>
                                    <Link to="/report">Report Waste</Link>
                                    <Link to="/pickup">Schedule Pickup</Link>
                                </>
                            )}
                        </nav>
                        
                        <div className="user-section">
                            {user ? (
                                <>
                                    <span className="welcome-text">
                                        Welcome, <strong>{user.name}</strong>
                                    </span>
                                    <button onClick={handleLogout} className="btn btn-danger">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="btn btn-secondary">
                                        Login
                                    </Link>
                                    <Link to="/signup" className="btn btn-primary">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="main-content">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h3>PWMS</h3>
                            <p>PWMS@gmail.com</p>
                            <p>info@PWMS.com</p>
                            <p>PWMS.com</p>
                        </div>
                        
                        <div className="footer-section">
                            <h4>Contact</h4>
                            <p>www.PWMS.com</p>
                            <p>63929</p>
                            <p>943299</p>
                        </div>
                        
                        <div className="footer-section">
                            <h4>Follow Us</h4>
                            <div className="social-icons">
                                <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" /></a>
                                <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Twitter" /></a>
                                <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="Instagram" /></a>
                                <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733614.png" alt="LinkedIn" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;