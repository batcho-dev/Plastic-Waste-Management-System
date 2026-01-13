import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        // Check if user is logged in on app load
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const loadUser = async () => {
        try {
            const response = await authAPI.getCurrentUser();
            const userData = response.data;
            
            // Map backend role to frontend role
            const frontendUser = {
                ...userData,
                role: userData.role === 'citizen' ? 'reporter' : userData.role
            };
            
            setUser(frontendUser);
            localStorage.setItem('user', JSON.stringify(frontendUser));
        } catch (error) {
            console.error('Failed to load user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password, role) => {
        try {
            const response = await authAPI.login(email, password, role);
            const { token: newToken, user: userData } = response.data;
            
            // Map backend role to frontend role
            const frontendUser = {
                ...userData,
                role: userData.role === 'citizen' ? 'reporter' : userData.role
            };
            
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(frontendUser));
            
            setToken(newToken);
            setUser(frontendUser);
            
            return { success: true, user: frontendUser };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Login failed. Please check your credentials.';
            return { success: false, error: errorMessage };
        }
    };

    const signup = async (userData) => {
        try {
            const response = await authAPI.signup(userData);
            return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Signup failed. Please try again.';
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        window.location.href = '/login';
    };

    const value = {
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!token,
        loadUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};