# Liquor Shop Backend API



## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Copy `.env.example` to `.env` (already done if you used the setup script).
   - Update `DATABASE_URL` with your MySQL credentials.
   - Update `KHALTI_SECRET_KEY` and `KHALTI_PUBLIC_KEY` for payments.
   - Update SMTP settings for email notifications.

3. **Database Setup**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Push schema to database
   npx prisma db push

   # Seed initial data (Admin user, products, riders)
   npx prisma db seed
   ```

4. **Run Server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Documentation

API endpoints are documented in `.rest` files located in the `api/` directory. You can use the REST Client extension in VS Code to test them directly.

- `api/auth.rest`: Authentication endpoints
- `api/products.rest`: Product management
- `api/cart.rest`: Shopping cart
- `api/orders.rest`: Order processing
- `api/payments.rest`: Khalti payments
- `api/deliveries.rest`: Delivery & Riders
- `api/credits.rest`: Credit transactions
- `api/analytics.rest`: Admin analytics

## Default Admin Credentials

- **Email**: `admin@liquor.com`
- **Password**: `Admin@123`

## Project Structure

- `src/config`: Configuration (DB, Email)
- `src/controllers`: Request handlers
- `src/middleware`: Auth, Role, Upload, Validation middleware
- `src/routes`: API route definitions
- `src/utils`: Helper functions (JWT, Khalti)
- `prisma`: Database schema and seed script
- `uploads`: Stored product images
