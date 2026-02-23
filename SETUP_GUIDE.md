# 🛒 Liquor Mart - Complete Setup Guide

This guide will help you set up and run the complete Liquor Mart application from scratch.

---

## 📋 Prerequisites

Before starting, you need to install these software on your computer:

### 1. **Install Node.js** (Required)
- Download from: https://nodejs.org/
- Choose the **LTS (Long Term Support)** version
- During installation, keep all default settings
- After installation, open Command Prompt and run:
  ```
  node -v
  ```
  You should see a version number (like v20.x.x)

### 2. **Install MySQL** (Required for database)
- Download MySQL from: https://dev.mysql.com/downloads/installer/
- Choose the **Windows (x86, 64-bit), MSI Installer**
- During installation:
  - Choose **"Developer Default"** or **"Full"** setup type
  - When asked for password, remember it! (We'll use `root` as password in this guide)
  - Complete the installation
- After installation, open **MySQL Workbench** to verify MySQL is running

---

## 🗄️ Step 1: Create Database

1. Open **MySQL Workbench** (installed with MySQL)
2. Click on your local connection
3. In the query window, run this SQL command:
   ```sql
   CREATE DATABASE liquorshop;
   ```
4. You should see a message saying "0 rows affected"

---

## ⚙️ Step 2: Configure Environment Variables

### Backend Configuration

1. Navigate to the `backend` folder
2. Create a new file called `.env` (copy from `.env.example`)
3. Open `.env` in a text editor (like Notepad)
4. Replace the content with:

```env
NODE_ENV=development
PORT=5000

# Database - CHANGE 'root' TO YOUR MYSQL PASSWORD IF DIFFERENT
DATABASE_URL="mysql://root:root@localhost:3306/liquorshop"

# JWT Secret (you can keep this or change it)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Khalti Payment (keep defaults for now - won't work but app will run)
KHALTI_SECRET_KEY=test-secret-key
KHALTI_PUBLIC_KEY=test-public-key
KHALTI_BACKEND_CALLBACK_URL=http://localhost:5000/api/v1/payments/khalti/callback
FRONTEND_BASE_URL=http://localhost:5173

# Email (keep defaults - emails won't send but app will work)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=Liquor Shop <noreply@liquorshop.com>

# Age Verification
MINIMUM_AGE=21

# File Upload
MAX_FILE_SIZE=5242880
```

> **Important**: If your MySQL password is NOT "root", change `root:root` to `your-username:your-password`

### Frontend Configuration

1. Navigate to the `frontend` folder
2. Create a new file called `.env` (copy from `.env.example`)
3. Open `.env` and ensure it has:
   ```
   VITE_API_URL=http://localhost:5000/api/v1
   VITE_BACKEND_URL=http://localhost:5000
   ```

---

## 📦 Step 3: Install Dependencies

### Install Backend Dependencies

1. Open Command Prompt
2. Navigate to backend folder:
   ```
   cd c:\Users\manishrai\Desktop\liquor-mart\backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
   This may take 1-2 minutes. Wait until it finishes.

### Install Frontend Dependencies

1. In Command Prompt, navigate to frontend folder:
   ```
   cd c:\Users\manishrai\Desktop\liquor-mart\frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
   This may take 1-2 minutes.

---

## 🗃️ Step 4: Set Up Database

1. In Command Prompt, make sure you're in the backend folder:
   ```
   cd c:\Users\manishrai\Desktop\liquor-mart\backend
   ```

2. Run database migrations (creates tables):
   ```
   npx prisma migrate dev --name init
   ```
   - Press Enter if asked about anything
   - Wait for it to complete

3. Generate Prisma client:
   ```
   npx prisma generate
   ```

4. **Seed the database** (creates sample data):
   ```
   npx prisma db seed
   ```
   
   You should see messages like:
   - "Created Admin: admin@liquor.com"
   - "Created Sample Products"
   - "Created Sample Riders"

---

## 🚀 Step 5: Run the Application

### Option A: Run Both Frontend and Backend Together

1. In Command Prompt, go to the main project folder:
   ```
   cd c:\Users\manishrai\Desktop\liquor-mart
   ```

2. Run the run.sh script:
   ```
   run.bat
   ```

   (If that doesn't work, create a file called `run.bat` with content below and run it)

### Option B: Run Manually (Recommended)

**Terminal 1 - Backend:**
1. Open a new Command Prompt
2. Navigate to backend:
   ```
   cd c:\Users\manishrai\Desktop\liquor-mart\backend
   ```
3. Start backend:
   ```
   npm run dev
   ```
4. You should see: "Server running on port 5000"

**Terminal 2 - Frontend:**
1. Open another Command Prompt
2. Navigate to frontend:
   ```
   cd c:\Users\manishrai\Desktop\liquor-mart\frontend
   ```
3. Start frontend:
   ```
   npm run dev
   ```
4. You should see: "Local: http://localhost:5173/"

---

## 🔑 Step 6: Login with Seeded Data

Once both servers are running, open your browser and go to:
**http://localhost:5173**

### Admin Login:
- **Email**: `admin@liquor.com`
- **Password**: `Admin@123`
- **Access**: Full admin panel at http://localhost:5173/admin

### What Else is Seeded:
- 18 sample products (Whiskey, Beer, Wine, Vodka, Tequila, Rum)
- 2 delivery riders
- 1 supplier party

---

## ❓ Troubleshooting

### Error: "Can't connect to MySQL server"
- Make sure MySQL is running (check MySQL Workbench)
- Check your password in `.env` file
- Try: Check if MySQL service is running in Windows Services

### Error: "Port 5000 already in use"
- Close other apps using port 5000, or
- Change PORT in backend/.env to 5001

### Error: "Port 5173 already in use"
- Close other apps using port 5173, or
- The frontend will automatically use next available port

### Need to reset everything?
1. Delete the `liquorshop` database in MySQL Workbench
2. Recreate it: `CREATE DATABASE liquorshop;`
3. Repeat Step 4 (migrations and seeding)

---

## ✅ What's Next?

After logging in as admin, you can:
- View/manage products
- View/manage orders
- Manage delivery riders
- View analytics dashboard
- Manage credit parties

To test as a customer:
1. Go to http://localhost:5173/register
2. Create a new account
3. Browse products and place orders
