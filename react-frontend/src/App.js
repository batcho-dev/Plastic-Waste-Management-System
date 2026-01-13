// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexts
import { AuthProvider } from './contexts/AuthContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages (we'll create these next)
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ReportPage from './pages/ReportPage';
import PickupPage from './pages/PickupPage';

// Styles
import './styles/global.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <ToastContainer 
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                
                <Routes>
                    {/* Public routes without layout */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    
                    {/* Routes with layout */}
                    <Route element={<Layout />}>
                        {/* Public route with layout */}
                        <Route path="/" element={<HomePage />} />
                        
                        {/* Protected routes */}
                        <Route path="/dashboard" element={
                            <ProtectedRoute allowedRoles={['reporter', 'collector', 'admin']}>
                                <DashboardPage />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/report" element={
                            <ProtectedRoute allowedRoles={['reporter']}>
                                <ReportPage />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/pickup" element={
                            <ProtectedRoute allowedRoles={['reporter']}>
                                <PickupPage />
                            </ProtectedRoute>
                        } />
                    </Route>
                    
                    {/* Fallback route */}
                    <Route path="*" element={<HomePage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;