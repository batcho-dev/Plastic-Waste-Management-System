import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { reportsAPI, pickupsAPI } from '../services/api';
import { toast } from 'react-toastify';
import styles from '../styles/DashboardPage.module.css';

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        points: 0,
        totalReports: 0,
        totalPickups: 0,
        pendingReports: 0,
        resolvedReports: 0,
        pendingPickups: 0,
        completedPickups: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadDashboardData();
        }
    }, [user]);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            
            // Fetch reports and pickups data
            const [reportsResponse, pickupsResponse] = await Promise.all([
                reportsAPI.getMyReports(),
                pickupsAPI.getMyPickups()
            ]);

            const reports = reportsResponse.data || [];
            const pickups = pickupsResponse.data || [];

            // Calculate stats
            const pendingReports = reports.filter(r => r.status === 'pending').length;
            const resolvedReports = reports.filter(r => r.status === 'resolved').length;
            const pendingPickups = pickups.filter(p => p.status === 'pending').length;
            const completedPickups = pickups.filter(p => p.status === 'collected' || p.status === 'completed').length;

            // Prepare recent activity
            const activities = [
                ...reports.slice(0, 3).map(report => ({
                    type: 'report',
                    text: `📝 Reported ${report.waste_type} waste at ${report.location}`,
                    date: new Date(report.created_at),
                    status: report.status
                })),
                ...pickups.slice(0, 2).map(pickup => ({
                    type: 'pickup',
                    text: `🚛 Scheduled pickup for ${pickup.pickup_date} at ${pickup.address}`,
                    date: new Date(pickup.created_at),
                    status: pickup.status
                }))
            ].sort((a, b) => b.date - a.date).slice(0, 5);

            setStats({
                points: user.points || 0,
                totalReports: reports.length,
                totalPickups: pickups.length,
                pendingReports,
                resolvedReports,
                pendingPickups,
                completedPickups
            });

            setRecentActivity(activities);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className={styles.dashboardPage}>
            {/* Header */}
            <div className={styles.dashboardHeader}>
                <div className="container">
                    <div className={styles.headerContent}>
                        <div>
                            <h1>Welcome back, {user?.name}!</h1>
                            <p className={styles.userInfo}>
                                Role: <span className={styles.roleBadge}>{user?.role}</span> | 
                                User ID: {user?.id}
                            </p>
                        </div>
                        <button onClick={handleLogout} className={styles.logoutButton}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Dashboard Cards */}
            <div className="container">
                <div className={styles.dashboardGrid}>
                    {/* Report Waste Card */}
                    <div className={styles.dashboardCard}>
                        <h2>Report Waste</h2>
                        <p>Quickly report plastic waste in your area to help keep the community clean.</p>
                        <Link to="/report" className={styles.cardButton}>
                            Report Now
                        </Link>
                        
                        <div className={styles.cardStats}>
                            <div className={styles.statItem}>
                                <div className={styles.statNumber}>{stats.pendingReports}</div>
                                <div className={styles.statLabel}>Pending</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statNumber}>{stats.resolvedReports}</div>
                                <div className={styles.statLabel}>Resolved</div>
                            </div>
                        </div>
                    </div>

                    {/* Points Card */}
                    <div className={styles.dashboardCard}>
                        <h2>Your Points</h2>
                        <div className={styles.pointsDisplay}>{stats.points}</div>
                        <p>You earn points each time you report plastic waste or schedule pickups.</p>
                        
                        <div className={styles.cardStats}>
                            <div className={styles.statItem}>
                                <div className={styles.statNumber}>{stats.totalReports}</div>
                                <div className={styles.statLabel}>Total Reports</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statNumber}>{stats.totalPickups}</div>
                                <div className={styles.statLabel}>Pickups</div>
                            </div>
                        </div>
                    </div>

                    {/* Pickup Management Card */}
                    <div className={styles.dashboardCard}>
                        <h2>Pickup Management</h2>
                        <p>Schedule and manage your plastic waste pickups.</p>
                        
                        <div className={styles.buttonGroup}>
                            <Link to="/pickup" className={styles.cardButton}>
                                Schedule Pickup
                            </Link>
                            <button 
                                className={`${styles.cardButton} ${styles.secondaryButton}`}
                                onClick={() => toast.info('View pickups feature coming soon!')}
                            >
                                View My Pickups
                            </button>
                        </div>
                        
                        <div className={styles.cardStats}>
                            <div className={styles.statItem}>
                                <div className={styles.statNumber}>{stats.pendingPickups}</div>
                                <div className={styles.statLabel}>Pending</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statNumber}>{stats.completedPickups}</div>
                                <div className={styles.statLabel}>Completed</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <section className={styles.activitySection}>
                    <div className={styles.activityContainer}>
                        <h2>My Recent Activity</h2>
                        
                        {recentActivity.length > 0 ? (
                            <div className={styles.activityList}>
                                {recentActivity.map((activity, index) => (
                                    <div key={index} className={styles.activityItem}>
                                        <div className={styles.activityIcon}>
                                            {activity.type === 'report' ? '📝' : '🚛'}
                                        </div>
                                        <div className={styles.activityContent}>
                                            <p className={styles.activityText}>{activity.text}</p>
                                            <div className={styles.activityMeta}>
                                                <span className={styles.activityDate}>
                                                    {activity.date.toLocaleDateString()}
                                                </span>
                                                <span className={`${styles.statusBadge} ${styles[activity.status]}`}>
                                                    {activity.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <p>No recent activity. Start by reporting waste or scheduling a pickup!</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* System Updates Section */}
                <section className={styles.updatesSection}>
                    <div className={styles.updatesContainer}>
                        <h2>System Updates</h2>
                        
                        <div className={styles.updateItem}>
                            <span className={styles.updateIcon}>♻</span>
                            <div className={styles.updateContent}>
                                <p><strong>New recycling facility opened in Bonaberi Zone.</strong></p>
                            </div>
                        </div>
                        
                        <div className={styles.updateItem}>
                            <span className={styles.updateIcon}>📢</span>
                            <div className={styles.updateContent}>
                                <p><strong>Reward program updated</strong> — earn bonus points for accurate reports.</p>
                            </div>
                        </div>
                        
                        <div className={styles.updateItem}>
                            <span className={styles.updateIcon}>🚛</span>
                            <div className={styles.updateContent}>
                                <p><strong>Pick-up delays expected</strong> due to road maintenance work in selected areas.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DashboardPage;