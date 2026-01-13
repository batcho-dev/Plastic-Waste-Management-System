import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/HomePage.module.css';

const HomePage = () => {
    return (
        <div className={styles.homePage}>
            {/* ===== HERO SECTION ===== */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <span className={styles.tag}>PWMS</span>
                    <h1>TRANSFORMING WASTE TO GOLD</h1>
                    <Link to="/signup" className={styles.ctaButton}>
                        Get Started
                    </Link>
                </div>
            </section>

            {/* ===== SUB-HERO ===== */}
            <section className={styles.subHero}>
                <div className="container">
                    <h2>Sustainable Solutions for a Greener Future</h2>
                    <p>Join us in making a difference today.</p>
                </div>
            </section>

            {/* ===== SERVICES ===== */}
            <section className={styles.services} id="services">
                <div className="container">
                    <h2 className={styles.sectionTitle}>Our Services</h2>
                    
                    <div className={styles.serviceContainer}>
                        <div className={styles.serviceBox}>
                            <img src="https://cdn-icons-png.flaticon.com/512/2909/2909808.png" alt="Waste Reporting" />
                            <h3>Waste Reporting</h3>
                            <p>A sustainable solution to collect and reduce waste pollution.</p>
                        </div>

                        <div className={styles.serviceBox}>
                            <img src="https://cdn-icons-png.flaticon.com/512/1046/1046747.png" alt="Trends" />
                            <h3>Trends</h3>
                            <p>Latest news on waste management techniques.</p>
                        </div>

                        <div className={styles.serviceBox}>
                            <img src="https://cdn-icons-png.flaticon.com/512/3500/3500815.png" alt="Waste Management" />
                            <h3>Waste Management Solutions</h3>
                            <p>Smart waste collection, monitoring, and recycling technologies for cleaner cities.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== ABOUT ===== */}
            <section className={styles.about} id="about">
                <div className="container">
                    <h2 className={styles.sectionTitle}>About</h2>
                    <div className={styles.aboutContainer}>
                        <p>
                            Our Plastic Waste Management System is a digital platform designed to connect households, waste collectors, and recycling centers in one simple and efficient system.
                            We make it easier for people to dispose of plastic waste properly while supporting recycling companies to work faster and smarter.
                            Our Mission is to reduce plastic pollution by using technology to simplify waste collection, encourage recycling, and empower communities to protect the environment.
                        </p>
                    </div>
                </div>
            </section>

            {/* ===== NEWS ===== */}
            <section className={styles.news} id="news">
                <div className="container">
                    <h2 className={styles.sectionTitle}>News</h2>
                    <div className={styles.newsContainer}>
                        <div className={styles.newsItem}>
                            <h4>🆕 Community Cleanup Drive Launched</h4>
                            <p>We successfully organized a community cleanup in partnership with local environmental clubs. Over <strong>200 kg of plastic</strong> was collected in just one day.</p>
                        </div>
                        <div className={styles.newsItem}>
                            <h4>♻️ New Recycling Center Added</h4>
                            <p>A new recycling partner has joined our platform, increasing our ability to process more plastic and reduce pollution in the city.</p>
                        </div>
                        <div className={styles.newsItem}>
                            <h4>🎁 Eco-Points Reward System Now Available</h4>
                            <p>Users can now earn points each time they recycle plastic. These points can be exchanged for airtime, discounts, or donations.</p>
                        </div>
                        <div className={styles.newsItem}>
                            <h4>🚛 Smart Pickup Scheduling Available</h4>
                            <p>We have developed a smarter pickup route system to help collectors work faster, save fuel, and reach more households.</p>
                        </div>
                        <div className={styles.newsItem}>
                            <h4>📚 Plastic Education Campaign Begins</h4>
                            <p>Our platform will feature new articles and videos to help people learn how to reduce plastic use at home, school, and work.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CONTACT ===== */}
            <section className={styles.contact} id="contact">
                <div className="container">
                    <h2 className={styles.sectionTitle}>Contact</h2>
                    <div className={styles.contactContainer}>
                        <h3>Get In Touch With Us</h3>
                        <p>We're here to help! If you have questions, suggestions, or need support, feel free to contact us.</p>
                        <div className={styles.contactInfo}>
                            <p><strong>🕒 Working Hours</strong></p>
                            <p>Monday – Friday: 8:00 AM – 5:00 PM</p>
                            <p>Saturday: 9:00 AM – 1:00 PM</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;