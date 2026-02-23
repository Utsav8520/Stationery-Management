# Frontend Development Plan for Liquor E-commerce Site

This document outlines the plan for building the frontend of the liquor e-commerce website using React, Vite, Tailwind CSS, and shadcn/ui.

## 1. Project Setup & Foundational Components

- **Routing:** Implement `react-router-dom` for navigation.
- **Layout:** Create a main layout with a Navbar, a main content area, and a footer.
- **API Client:** Set up a utility for making API calls to the backend using `fetch`.
- **Authentication Context:** Create a global context to manage user authentication state (token, user details, role).

## 2. Pages and Features

### 2.1. Public & User-Facing Pages

-   **Home Page (`/`):**
    -   Display featured products.
    -   Visually appealing hero section.
-   **Products Page (`/products`):**
    -   Display all products with pagination.
    -   Search and filter functionality (by category).
-   **Product Detail Page (`/products/:id`):**
    -   Show detailed information for a single product.
    -   "Add to Cart" button.
-   **Login Page (`/login`):**
    -   Forms for customer and admin login.
-   **Register Page (`/register`):**
    -   User registration form with name, email, password, address, and birthdate for age verification.
-   **Cart Page (`/cart`):**
    -   Display items in the cart.
    -   Allow users to update quantity or remove items.
    -   Proceed to checkout button.
-   **User Profile Page (`/profile`):**
    -   View and update user profile information.
-   **Orders Page (`/orders`):**
    -   Display a list of the user's past orders.
-   **Order Detail Page (`/orders/:id`):**
    -   Show details of a specific order.

### 2.2. Admin-Only Pages (under `/admin` path)

-   **Admin Dashboard (`/admin`):**
    -   Central hub for administrative tasks.
    -   Display key analytics.
-   **Product Management (`/admin/products`):**
    -   List all products.
    -   Forms to create, update (with image upload), and delete products.
    -   Functionality to update stock levels.
-   **Order Management (`/admin/orders`):**
    -   List all user orders.
    -   Update order status.
-   **Delivery Management (`/admin/deliveries`):**
    -   Manage delivery riders (CRUD).
    -   Assign riders to orders.
-   **Analytics Page (`/admin/analytics`):**
    -   Detailed view of sales, stock, and order analytics.
-   **Credit Management (`/admin/credits`):**
    -   Manage credit parties and transactions.

## 3. Component Strategy

-   Utilize pre-built `shadcn/ui` components for UI elements like buttons, cards, forms, tables, etc.
-   Create custom, reusable components for specific features:
    -   `ProductCard`: To display product information consistently.
    -   `Navbar`: For site navigation.
    -   `Footer`: For the bottom of the page.
    -   `ProtectedRoute`: To guard routes based on user authentication and roles.
    -   `AdminLayout`: A specific layout for the admin section.

## 4. Development Phases

1.  **Phase 1: Setup and Authentication**
    -   Initialize router and base layout.
    -   Implement Login, Register pages and the authentication context.
2.  **Phase 2: Core E-commerce Flow**
    -   Develop Home, Products, and Product Detail pages.
    -   Implement the shopping cart functionality.
    -   Implement the checkout process to create an order.
3.  **Phase 3: User Features**
    -   Build the user profile and order history pages.
4.  **Phase 4: Admin Panel**
    -   Build out all the admin-specific management pages.
5.  **Phase 5: Styling and Refinement**
    -   Ensure the UI is polished, responsive, and visually appealing.
    -   Code cleanup and optimization.
