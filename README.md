# LiquorShop - E-Commerce Platform

A modern, full-stack e-commerce platform for liquor sales built with React, Node.js, Express, and MySQL.


## 🔐 Test Credentials

### Admin Account
- **Email:** `admin@liquor.com`
- **Password:** `Admin@123`
- **Access:** Full admin dashboard with all management features

### Customer Account
To test as a customer, register a new account through the registration page.

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

## 🛠️ Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
DATABASE_URL="mysql://username:password@localhost:3306/liquorshop"
JWT_SECRET="your-secret-key-here"
PORT=5000
```

4. Run Prisma migrations:
```bash
npx prisma migrate dev
```

5. Seed the database:
```bash
npx prisma db seed
```

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_BACKEND_URL=http://localhost:5000
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📦 Seeded Data

The database seed includes:

- **1 Admin User** (credentials above)
- **18 Products** across all categories
  - 6 Featured premium products
  - 12 Regular products
- **2 Sample Riders** for delivery
- **1 Sample Party** for credit transactions

## 🎨 Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- shadcn/ui components
- React Router DOM
- Axios
- Lucide React (icons)
- Sonner (toast notifications)

### Backend
- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT Authentication
- bcryptjs
- Multer (file uploads)

## 📱 Key Pages

- **Homepage** - Hero section, featured products, categories
- **Products** - Browse all products with filters and search
- **Product Detail** - Detailed product view with related products
- **Cart** - Shopping cart management
- **Orders** - Order history and tracking
- **Admin Dashboard** - Analytics and management tools

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Age verification (21+)
- Role-based access control (Admin/Customer)
- Protected routes

## 📄 API Documentation

API endpoints are available at:
- Base URL: `http://localhost:5000/api/v1`

### Main Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /cart/add` - Add to cart
- `POST /orders` - Create order
- `GET /admin/*` - Admin routes (protected)

## 🎯 Getting Started

1. Start the backend server
2. Start the frontend development server
3. Visit `http://localhost:5173`
4. Login with admin credentials or register as a customer
5. Browse products and test features

## 📝 Notes

- Age verification is required (21+)
- Payment integration uses Khalti (Nepal)
- Free shipping on orders over Rs. 5,000
- Delivery within 2-3 business days in Kathmandu Valley

## 🤝 Contributing

This is a demo project. Feel free to fork and modify as needed.

## 📧 Contact

For questions or issues, please contact the development team.

---

**⚠️ Important:** This is a demo e-commerce platform. Ensure proper licensing and age verification systems are in place before deploying for actual liquor sales.
