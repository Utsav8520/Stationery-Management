# Updated Liquor E-Commerce Site Project Documentation

This is a further updated version of the project documentation incorporating the new requirements: add-to-cart functionality, user profile management, pagination across relevant APIs, email notifications using Nodemailer, age verification, analytics for admin, file uploads for product images (stored in an `/uploads` folder), and enhanced delivery management with delivery riders (profiles added by admin, orders assignable to riders). I've also verified Khalti's documentation: Khalti uses a callback URL (GET request with query params) for payment notifications rather than a traditional webhook (POST). It's recommended to verify payments server-side using their lookup API after the callback. No separate webhook setup is needed; the callback handles the redirect from Khalti. I've updated the payment section accordingly.

The categories for liquor (e.g., wine, tequila) are already supported via the `Product.category` field. Admins can set categories when adding/updating products. If you need a separate Category model for managing categories independently (e.g., listing all categories), let me know for further expansion.

The rest of the document builds on the previous version.

## 1. Project Overview
This project is for a single-vendor e-commerce website specializing in liquor sales. It focuses on minimal functionality with the added features for usability. Key features include:
- **Stock Management**: Track inventory levels for products, with updates on sales and restocking.
- **Credit Transactions with Parties**: A basic ledger system for managing credit-based transactions with external parties (e.g., suppliers or wholesale customers).
- **Khalti Payment Integration**: Integrate Khalti for online payments, using callback URL and server-side verification via lookup API.
- **Order Management**: Handle order creation, status updates, and viewing order history.
- **Delivery System**: Manage deliveries, including adding delivery riders (profiles by admin), assigning orders to riders, tracking status.
- **Search Functionality**: Text-based search for products.
- **New: Add-to-Cart Functionality**: Temporary cart for users to add items before checkout.
- **New: User Profile Management**: Users can view and update their profiles.
- **New: Pagination**: Applied to list-based GET routes (e.g., products, orders).
- **New: Email Notifications**: Send emails for order confirmations, payment success, etc., using Nodemailer.
- **New: Age Verification**: Require birthdate on registration; enforce 21+ (or local legal age) for orders.
- **New: Analytics**: Basic admin dashboard stats (e.g., sales, low stock).
- **New: File Uploads**: For product images, using Multer to store in `/uploads`.

Assumptions:
- Legal age for liquor: 21 (adjust as per region).
- Email: Use SMTP (e.g., Gmail) via Nodemailer; configure in `.env`.
- File Storage: Local `/uploads` folder (for simplicity; consider S3 for production).
- Frontend: Separate, consumes APIs.

**Project Goals**:
- Build a scalable backend API with added features.
- Document all APIs in `.rest` files in `/api` folder.
- Use MySQL, Prisma, Express.

## 2. Tech Stack
- **Backend Framework**: Express.js (Node.js)
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Payment Gateway**: Khalti SDK
- **File Uploads**: Multer (`npm i multer`)
- **Email**: Nodemailer (`npm i nodemailer`)
- **Other Libraries**: As before, plus `express-rate-limit` for security, `express-validator` for input validation.
- **Documentation**: `.rest` files in `/api`.
- **Testing/Deployment**: As before.

## 3. Database Schema (Prisma Models)
Updated for new features: Added `Cart` and `CartItem` models, `birthdate` to `User` for age verification, `Rider` model for delivery, `riderId` to `Delivery`. Added indexes for pagination/search.

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  role      Role     @default(CUSTOMER)
  name      String?
  address   String?
  birthdate DateTime? // For age verification (required for customers)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  orders    Order[]
  credits   CreditTransaction[]
  cart      Cart?
}

enum Role {
  ADMIN
  CUSTOMER
}

model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Float
  stock       Int      @default(0)
  imageUrl    String?  // Path like '/uploads/image.jpg'
  category    String?  // e.g., Wine, Tequila
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  orderItems  OrderItem[]
  cartItems   CartItem[]

  @@index([name])
  @@index([category])
}

model Cart {
  id        Int      @id @default(autoincrement())
  userId    Int      @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User      @relation(fields: [userId], references: [id])
  items     CartItem[]
}

model CartItem {
  id        Int      @id @default(autoincrement())
  cartId    Int
  productId Int
  quantity  Int      @default(1)

  cart      Cart     @relation(fields: [cartId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])
}

model Order {
  id          Int      @id @default(autoincrement())
  userId      Int
  totalAmount Float
  status      OrderStatus @default(PENDING)
  paymentId   Int?
  deliveryId  Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User      @relation(fields: [userId], references: [id])
  items       OrderItem[]
  payment     Payment?  @relation(fields: [paymentId], references: [id])
  delivery    Delivery? @relation(fields: [deliveryId], references: [id])
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
}

model OrderItem {
  id        Int      @id @default(autoincrement())
  orderId   Int
  productId Int
  quantity  Int
  price     Float

  order     Order    @relation(fields: [orderId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])
}

model Payment {
  id          Int      @id @default(autoincrement())
  orderId     Int?
  amount      Float
  method      String
  status      PaymentStatus @default(PENDING)
  pidx        String?  // Khalti payment identifier
  createdAt   DateTime @default(now())

  order       Order?   @relation(fields: [orderId], references: [id])
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
}

model Delivery {
  id          Int      @id @default(autoincrement())
  orderId     Int?
  riderId     Int?     // Assigned rider
  address     String
  status      DeliveryStatus @default(PENDING)
  trackingId  String?
  deliveryPartner String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  order       Order?   @relation(fields: [orderId], references: [id])
  rider       Rider?   @relation(fields: [riderId], references: [id])
}

enum DeliveryStatus {
  PENDING
  OUT_FOR_DELIVERY
  DELIVERED
  FAILED
}

model Rider {
  id        Int      @id @default(autoincrement())
  name      String
  contact   String?
  vehicle   String?  // e.g., Bike, Van
  status    RiderStatus @default(ACTIVE) // Enum: ACTIVE, INACTIVE
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  deliveries Delivery[]
}

enum RiderStatus {
  ACTIVE
  INACTIVE
}

// Other models (Party, CreditTransaction) remain the same
```

**Notes**:
- **Age Verification**: On registration, calculate age from `birthdate`. Middleware checks age >= 21 on order creation.
- **Cart**: One cart per user; cleared on order creation.
- **Delivery Riders**: Admin manages riders; assign via `riderId` in Delivery.
- **File Uploads**: `imageUrl` stores relative path (e.g., '/uploads/product-1.jpg').
- **Categories**: Use strings like 'Wine', 'Tequila'; admin sets on product creation.

## 4. API Routes (Express)
Updated with new routes. Pagination: Use ?page=1&limit=10 (default limit 10). In controllers, use Prisma `skip` and `take`.

### 4.1 Authentication Routes
- `POST /auth/register`: Register (customer). Body: {email, password, name, address, birthdate}. Validates age >= 21.
- `POST /auth/login`: Login. Returns JWT.
- `POST /auth/admin/login`: For admin.

### 4.2 User Profile Routes (New)
- `GET /users/me`: Get current user profile (Authenticated).
- `PUT /users/me`: Update profile. Body: {name, address, birthdate}. Re-validates age if birthdate changed.

### 4.3 Product Routes
- `GET /products`: List products (paginated, filters: ?category=Wine&stock>0).
- `GET /products/search?query=term&page=1&limit=10`: Paginated search.
- `GET /products/:id`: Get by ID.
- `POST /products` (Admin): Add product. Body: {name, ..., category}. Supports multipart/form-data for image upload.
- `PUT /products/:id` (Admin): Update, with optional image upload.
- `DELETE /products/:id` (Admin).
- `PUT /products/:id/stock` (Admin): Restock.

**File Upload Notes**: Use Multer middleware: `const upload = multer({ dest: 'uploads/' });` in route: `app.post('/products', authMiddleware, adminMiddleware, upload.single('image'), controller);`. Save filename to `imageUrl`.

### 4.4 Cart Routes (New)
- `POST /cart/add`: Add item (Authenticated). Body: {productId, quantity}. Creates/updates cart.
- `GET /cart`: Get user's cart (with items).
- `PUT /cart/item/:productId`: Update quantity. Body: {quantity}.
- `DELETE /cart/item/:productId`: Remove item.
- `DELETE /cart`: Clear cart.

**Integration**: On order creation, copy from cart if provided, then clear cart.

### 4.5 Order Routes
- `POST /orders`: Create from cart or items. Validates age, stock. Sends email notification.
- `GET /orders?page=1&limit=10`: Paginated user's orders (Customer) or all (Admin).
- `GET /orders/:id`: Details.
- `PUT /orders/:id/status` (Admin): Update status. Triggers email if status changes (e.g., shipped).

### 4.6 Payment Routes (Khalti Updated)
- `POST /payments/khalti/initiate`: Initiate for order. Body: {orderId, amount}. Returns payment_url. Set return_url to '/api/v1/payments/khalti/callback'.
- `GET /payments/khalti/callback`: Handles Khalti redirect (GET with query: pidx, status, etc.). Verifies with Khalti lookup API, updates Payment.status, Order.status to PAID on success. Triggers email.
- `GET /payments/:orderId`: Status.

**Khalti Notes**:
- Use SDK for initiate/lookup.
- In callback: If status='Completed', call lookup to confirm. Update DB only on verified success.
- `.env`: KHALTI_SECRET_KEY.
- No webhook; callback is sufficient with verification.

### 4.7 Delivery Routes (Updated with Riders)
- `POST /riders` (Admin): Add rider. Body: {name, contact, vehicle}.
- `GET /riders?page=1&limit=10` (Admin): Paginated list.
- `PUT /riders/:id` (Admin): Update rider.
- `DELETE /riders/:id` (Admin).
- `POST /deliveries` (Admin): Assign to order. Body: {orderId, address, riderId, deliveryPartner}.
- `PUT /deliveries/:id/status` (Admin): Update status.
- `PUT /deliveries/:id/assign` (Admin): Assign/reassign rider. Body: {riderId}.
- `GET /deliveries/:orderId`: Details.

### 4.8 Credit Transaction Routes
- Updated with pagination: `GET /credits/parties?page=1&limit=10`, `GET /credits/transactions/:partyId?page=1&limit=10`.

### 4.9 Analytics Routes (New, Admin Only)
- `GET /admin/analytics/sales`: Total sales, by period (?from=YYYY-MM-DD&to=YYYY-MM-DD).
- `GET /admin/analytics/stock`: Low-stock products (?threshold=10).
- `GET /admin/analytics/orders`: Order stats (count by status).

Use Prisma aggregates (e.g., sum, count).

## 5. Documentation in .rest Files
Update files like `cart.rest`, `users.rest`, `deliveries.rest`. Include examples with pagination, file uploads (use multipart in REST Client), etc.

## 6. Other Things Needed
- **Folder Structure**: Add `/uploads` (gitignore large files). Add `/controllers/analytics.js`, `/routes/cart.js`, `/routes/users.js`, `/routes/riders.js`.
- **Setup Steps**: Install new deps: `npm i multer nodemailer`.
- **Email Configuration**: In `.env`: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS. Example sender: order confirmation on create/paid.
- **Age Verification Middleware**: Custom middleware for order routes: Check user age from birthdate.
- **Security**: Validate uploads (image types only), rate limit, HTTPS.
- **Error Handling/Testing**: As before, test new features (e.g., cart to order flow, age checks).
- **Next Steps**: Seed DB with sample categories/products/riders. Implement frontend. Test Khalti in dev mode (use dev.khalti.com).

This incorporates all requested additions. If you want code snippets or further tweaks, let me know!
