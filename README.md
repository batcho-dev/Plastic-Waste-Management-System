# Plastic-Waste-Management-System
A comprehensive system for managing plastic waste collection, recycling, and disposal. Track, monitor, and optimize plastic waste management processes.
# Plastic Waste Management System - Local Setup Guide

## 🚀 Quick Start (5 Minutes Setup)

Get the application running on your local machine in just 5 minutes!

### 📋 Prerequisites Checklist
- [ ] **Node.js** installed (v14 or higher) - [Download Node.js](https://nodejs.org/)
- [ ] **MySQL** installed (v5.7 or higher) - [Download MySQL](https://dev.mysql.com/downloads/)
- [ ] **Git** installed (optional but recommended) - [Download Git](https://git-scm.com/)
- [ ] Code editor (VS Code recommended) - [Download VS Code](https://code.visualstudio.com/)

---

## 🗄️ Step 1: Database Setup (2 minutes)

### Option A: Using MySQL Command Line
```bash
# 1. Start MySQL (if not running)
# On Windows: Check MySQL service in Services.msc
# On Mac/Linux: sudo systemctl start mysql

# 2. Login to MySQL
mysql -u root -p

# 3. Run the complete schema file
# Copy the entire schema below and paste in MySQL
# OR save schema as a file and run:
source /path/to/schema.sql
```

### 📊 Complete Database Schema

Copy and paste this entire SQL script into your MySQL:

```sql
-- ============================================
-- PLASTIC WASTE MANAGEMENT SYSTEM - COMPLETE SCHEMA
-- ============================================

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS pwms_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE pwms_db;

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    full_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(120) UNIQUE NOT NULL,
    password        VARCHAR(255) NOT NULL,
    phone           VARCHAR(20) UNIQUE,
    role            ENUM('citizen', 'collector', 'admin') NOT NULL DEFAULT 'citizen',
    points          INT DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 2. WASTE REPORTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS waste_reports (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    reporter_id     INT NOT NULL,
    location        VARCHAR(255) NOT NULL,
    waste_type      ENUM('bottles', 'bags', 'packaging', 'mixed', 'other') NOT NULL,
    description     TEXT,
    image_url       VARCHAR(255),
    status          ENUM('pending', 'in_progress', 'resolved', 'rejected') DEFAULT 'pending',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_reporter_status (reporter_id, status),
    INDEX idx_status (status)
);

-- ============================================
-- 3. PICKUP REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pickup_requests (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    collector_id    INT,
    pickup_date     DATE NOT NULL,
    pickup_time     TIME NOT NULL,
    address         VARCHAR(255) NOT NULL,
    notes           TEXT,
    status          ENUM('pending', 'confirmed', 'collected', 'cancelled') DEFAULT 'pending',
    points_earned   INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id)       REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (collector_id)  REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_status (user_id, status),
    INDEX idx_collector_status (collector_id, status),
    INDEX idx_pickup_date (pickup_date)
);

-- ============================================
-- 4. USER ACTIVITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_activities (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    activity_type   VARCHAR(50) NOT NULL,
    description     TEXT NOT NULL,
    points_earned   INT DEFAULT 0,
    reference_id    INT,
    reference_type  VARCHAR(50),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_activity (user_id, activity_type),
    INDEX idx_created_at (created_at)
);

-- ============================================
-- 5. POINT TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS point_transactions (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    points          INT NOT NULL,
    description     VARCHAR(150) NOT NULL,
    reference_id    INT,
    reference_type  VARCHAR(50),
    balance_after   INT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_points (user_id, created_at)
);

-- ============================================
-- 6. USER NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_notifications (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    message         TEXT NOT NULL,
    type            ENUM('points', 'pickup', 'report', 'system', 'reward') DEFAULT 'system',
    is_read         BOOLEAN DEFAULT FALSE,
    reference_id    INT,
    reference_type  VARCHAR(50),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_unread (user_id, is_read)
);

-- ============================================
-- 7. NEWS/ANNOUNCEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS news (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(150) NOT NULL,
    content         TEXT NOT NULL,
    image_url       VARCHAR(255),
    created_by      INT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_created_at (created_at)
);

-- ============================================
-- 8. REWARDS TABLE (Optional for future)
-- ============================================
CREATE TABLE IF NOT EXISTS rewards (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    points_required INT NOT NULL,
    image_url       VARCHAR(255),
    stock           INT DEFAULT -1,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 9. REWARD REDEMPTIONS TABLE (Optional for future)
-- ============================================
CREATE TABLE IF NOT EXISTS reward_redemptions (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    reward_id       INT NOT NULL,
    points_spent    INT NOT NULL,
    status          ENUM('pending', 'approved', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    redeemed_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reward_id) REFERENCES rewards(id) ON DELETE CASCADE,
    INDEX idx_user_status (user_id, status)
);

-- ============================================
-- INSERT SAMPLE DATA FOR TESTING
-- ============================================

-- Insert sample users
INSERT INTO users (full_name, email, password, phone, role, points) VALUES
('John Citizen', 'john@example.com', '$2a$10$YourHashedPasswordHere', '1234567890', 'citizen', 150),
('Sarah Collector', 'sarah@example.com', '$2a$10$YourHashedPasswordHere', '0987654321', 'collector', 0),
('Admin User', 'admin@example.com', '$2a$10$YourHashedPasswordHere', '5551234567', 'admin', 0),
('Emma Reporter', 'emma@example.com', '$2a$10$YourHashedPasswordHere', '1112223333', 'citizen', 75)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Insert sample waste reports
INSERT INTO waste_reports (reporter_id, location, waste_type, description, status) VALUES
(1, 'Central Park, Main Gate', 'bottles', 'Multiple plastic bottles scattered near benches', 'resolved'),
(1, 'Market Street, near bakery', 'bags', 'Plastic bags stuck in trees', 'pending'),
(4, 'River side road', 'mixed', 'Mixed plastic waste accumulated', 'in_progress'),
(4, 'Residential Area Block B', 'packaging', 'Food packaging waste not disposed properly', 'pending')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Insert sample pickup requests
INSERT INTO pickup_requests (user_id, pickup_date, pickup_time, address, status, points_earned) VALUES
(1, CURDATE() + INTERVAL 1 DAY, '10:00:00', '123 Green Street, Apt 4B', 'collected', 50),
(1, CURDATE() + INTERVAL 3 DAY, '14:30:00', '123 Green Street, Apt 4B', 'confirmed', 0),
(4, CURDATE() + INTERVAL 2 DAY, '11:00:00', '456 Eco Avenue', 'pending', 0)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Insert sample activities
INSERT INTO user_activities (user_id, activity_type, description, points_earned, reference_id, reference_type) VALUES
(1, 'report_submitted', 'Reported bottles waste at Central Park, Main Gate', 10, 1, 'waste_report'),
(1, 'pickup_completed', 'Plastic waste pickup at 123 Green Street', 50, 1, 'pickup_request'),
(4, 'report_submitted', 'Reported mixed waste at River side road', 10, 3, 'waste_report'),
(4, 'report_submitted', 'Reported packaging waste at Residential Area Block B', 10, 4, 'waste_report')
ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP;

-- Insert sample notifications
INSERT INTO user_notifications (user_id, message, type, is_read) VALUES
(1, '10 points earned for reporting waste', 'points', TRUE),
(1, 'Your pickup request has been confirmed', 'pickup', FALSE),
(1, '50 points earned for completed pickup', 'points', TRUE),
(4, '10 points earned for reporting waste', 'points', FALSE)
ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP;

-- Insert sample news
INSERT INTO news (title, content, created_by) VALUES
('New Recycling Center Opening', 'A new recycling center will open next month in the downtown area. Stay tuned for more details!', 3),
('Points System Update', 'We have updated our points system. You now earn more points for accurate reports!', 3),
('Community Cleanup Day', 'Join us this Saturday for a community cleanup event. Earn bonus points!', 3)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check all tables
SELECT 'Tables created:' AS '';
SHOW TABLES;

-- Check users with points
SELECT 'User Points Summary:' AS '';
SELECT id, full_name, email, role, points, created_at 
FROM users 
ORDER BY points DESC;

-- Check recent reports
SELECT 'Recent Waste Reports:' AS '';
SELECT 
    w.id,
    u.full_name as reporter,
    w.location,
    w.waste_type,
    w.status,
    w.created_at
FROM waste_reports w
JOIN users u ON w.reporter_id = u.id
ORDER BY w.created_at DESC
LIMIT 5;

-- Check recent pickups
SELECT 'Recent Pickup Requests:' AS '';
SELECT 
    p.id,
    u.full_name as user,
    p.pickup_date,
    p.pickup_time,
    p.status,
    p.points_earned
FROM pickup_requests p
JOIN users u ON p.user_id = u.id
ORDER BY p.pickup_date DESC
LIMIT 5;
```

### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Create a new SQL tab
4. Copy and paste the entire schema above
5. Click the lightning bolt icon to execute
6. Verify all tables are created

**✅ Verification:** Run this in MySQL to confirm setup:
```sql
USE pwms_db;
SHOW TABLES;
SELECT * FROM users;
```

---

## ⚙️ Step 2: Backend Setup (1.5 minutes)

```bash
# 1. Navigate to backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Create environment configuration file
# Copy .env.example to .env
cp .env.example .env  # On Windows: copy .env.example .env

# 4. Edit .env file with your database credentials
# Open .env in your text editor and update:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password  # ← Change this!
DB_NAME=pwms_db
PORT=5000
JWT_SECRET=your_jwt_secret_key_here

# 5. Start the backend server
npm run dev
```

**✅ Success:** You should see:
```
Server running on port 5000
Database connected successfully
```

---

## 🎨 Step 3: Frontend Setup (1.5 minutes)

```bash
# 1. Open a NEW terminal window/tab
# 2. Navigate to react-frontend folder
cd react-frontend

# 3. Install dependencies
npm install

# 4. Start the React application
npm start
```

**✅ Success:** Your browser should automatically open at:
```
http://localhost:3000
```

If browser doesn't open automatically, manually visit: http://localhost:3000

---

## 🔐 Step 4: Test the Application (1 minute)

### Default Test Accounts:
Try these pre-created accounts (use password: `password123` for all):

1. **Citizen Account:** `john@example.com` (150 points)
2. **Collector Account:** `sarah@example.com` 
3. **Admin Account:** `admin@example.com`
4. **Another Citizen:** `emma@example.com` (75 points)

### Quick Feature Tests:

1. **Login** with any account above
2. **Report Waste:**
   - Click "Report Waste" in navigation
   - Fill location, waste type, and description
   - Submit to earn 10 points
3. **Request Pickup:**
   - Click "Request Pickup"
   - Schedule a collection
4. **View Dashboard:**
   - See your points, recent activities, and notifications
5. **Admin Features** (admin account only):
   - Manage all reports
   - View system analytics
   - Create announcements

---

## 🛠️ Troubleshooting Guide

### ❌ Backend Won't Start?

**Error: "Cannot connect to MySQL"**
```bash
# 1. Check if MySQL is running
# Windows: Open Services (services.msc), find "MySQL", ensure it's "Running"
# Mac/Linux: sudo systemctl status mysql

# 2. Verify credentials in .env file
# Make sure DB_PASSWORD matches your MySQL root password

# 3. Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# 4. Create database if missing
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS pwms_db;"
```

**Error: "Port 5000 already in use"**
```bash
# Change port in backend/.env
PORT=5001

# Also update frontend/.env file:
REACT_APP_API_URL=http://localhost:5001
```

### ❌ Frontend Won't Start?

**Error: "'react-scripts' not recognized"**
```bash
# In react-frontend folder:
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm start
```

**Error: "Can't connect to backend"**
```bash
# 1. Check if backend is running
# Run in backend folder: npm run dev

# 2. Check API URL in react-frontend/.env
REACT_APP_API_URL=http://localhost:5000

# 3. Check CORS in browser console (F12)
```

### ❌ Database Issues?

**Error: "Table doesn't exist"**
```sql
-- Re-run the complete schema above
```

**Error: "Access denied for user"**
```sql
-- Grant privileges (run in MySQL as root):
GRANT ALL PRIVILEGES ON pwms_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

---

## 📱 Testing API with Postman (Optional)

### Test Endpoints:

**1. User Registration:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "full_name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "citizen"
}
```

**2. User Login:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**3. Get Waste Reports (requires token):**
```
GET http://localhost:5000/api/reports
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📁 Project Structure

```
Plastic-Waste-Management-System/
├── backend/                    # Node.js Express API
│   ├── models/                # Database models
│   ├── controllers/           # Business logic
│   ├── routes/                # API endpoints
│   ├── middleware/            # Auth & validation
│   └── server.js              # Main server file
│
├── react-frontend/            # React Application
│   ├── public/                # Static files
│   └── src/
│       ├── components/        # Reusable UI components
│       ├── pages/             # Main pages (Login, Dashboard, etc.)
│       ├── contexts/          # React Context API
│       ├── services/          # API service calls
│       ├── styles/            # CSS modules
│       └── utils/             # Helper functions
│
└── database/                  # SQL files & migrations
    └── schema.sql            # Complete database schema
```

---

## 🗃️ Database Schema Summary

### Core Tables:
1. **`users`** - User accounts with roles (citizen, collector, admin)
2. **`waste_reports`** - Reports of plastic waste with location and type
3. **`pickup_requests`** - Scheduled waste collection requests
4. **`user_activities`** - Log of user actions and earned points
5. **`point_transactions`** - Detailed point earning/spending history
6. **`user_notifications`** - In-app notifications for users
7. **`news`** - System announcements and updates

### Optional Future Tables:
8. **`rewards`** - Available rewards for point redemption
9. **`reward_redemptions`** - User reward claims history

---

## 🎯 Key Features Working Locally

✅ **User Authentication & Authorization**
- Register/Login with different roles
- JWT token-based sessions
- Role-based access control

✅ **Waste Management**
- Report plastic waste with location
- Upload waste images
- Track report status

✅ **Pickup System**
- Schedule waste collection
- Assign collectors
- Earn reward points

✅ **Points & Rewards**
- Earn points for reports and pickups
- Track point transactions
- View activity history

✅ **Admin Dashboard**
- Manage all users
- View system analytics
- Create announcements

---

## 🔄 Common Commands Reference

### Backend Commands:
```bash
npm start          # Start production server
npm run dev        # Start development server with auto-reload
npm test           # Run tests
```

### Frontend Commands:
```bash
npm start          # Start development server (http://localhost:3000)
npm run build      # Build for production
npm test           # Run React tests
```

### MySQL Commands:
```bash
# Login to MySQL
mysql -u root -p

# Useful queries
USE pwms_db;                    # Select database
SHOW TABLES;                    # List all tables
DESCRIBE users;                 # Show table structure
SELECT * FROM users LIMIT 5;    # View sample data
```

---

## 🚨 Important Security Notes for Local Use

1. **Change Default Passwords:**
   - Change MySQL root password
   - Update JWT_SECRET in .env
   - Change default user passwords in schema.sql

2. **Environment Variables:**
   - Never commit .env files to version control
   - Use .env.example as a template

3. **Database Backups:**
   ```bash
   # Backup your database
   mysqldump -u root -p pwms_db > backup.sql
   
   # Restore from backup
   mysql -u root -p pwms_db < backup.sql
   ```

---

## 🆘 Need Help?

1. **Check Logs:**
   - Backend: Look at terminal output
   - Frontend: Check browser console (F12 → Console tab)
   - Database: MySQL error logs

2. **Common Issues:**
   - Port conflicts: Change ports in .env files
   - CORS errors: Ensure backend is running
   - Database connection: Verify MySQL credentials

3. **Reset Everything:**
   ```bash
   # 1. Drop and recreate database
   mysql -u root -p -e "DROP DATABASE pwms_db; CREATE DATABASE pwms_db;"
   
   # 2. Re-run schema.sql
   mysql -u root -p pwms_db < database/schema.sql
   
   # 3. Restart both servers
   ```

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure MySQL service is running
4. Check all environment variables are set

**Remember:** This is a local development setup. For production deployment, additional security and configuration steps are required.

---

Happy coding! ♻️🌍

*"Join the fight against plastic pollution, one report at a time."*