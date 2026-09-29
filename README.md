# FixMyHome - Full-Stack Home Services Booking Platform

FixMyHome is a complete, responsive, and professional full-stack web application designed for booking home services like plumbing, cleaning, AC repair, and more. 

## Technology Stack

*   **Frontend**: React.js (Vite), React Router DOM, Tailwind CSS, Axios, Lucide React, React Hot Toast
*   **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose), JWT authentication, bcryptjs
*   **Security**: CORS, Helmet, express-validator

## Project Folder Structure

```
fixmyhome/
├── client/                 # Frontend React Application
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, etc.)
│   │   ├── context/        # React Context (AuthContext)
│   │   ├── layouts/        # Page layouts (MainLayout)
│   │   ├── pages/          # Application pages (Home, Login, Dashboards)
│   │   └── utils/          # Utilities (Axios instance)
│   ├── .env.example
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Backend Node.js/Express API
│   ├── scripts/            # Database seeder script
│   ├── src/
│   │   ├── config/         # Database connection (db.js)
│   │   ├── controllers/    # Route controllers (auth, services, bookings)
│   │   ├── middleware/     # Custom middleware (auth, error handler)
│   │   ├── models/         # Mongoose schemas
│   │   └── routes/         # Express routes
│   ├── .env.example
│   ├── app.js              # Express app setup
│   ├── server.js           # Server entry point
│   └── package.json
└── README.md
```

## Setup Instructions

### 1. Prerequisites
*   Node.js (v18+)
*   MongoDB Atlas Account (or local MongoDB)

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd fixmyhome/server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create environment variables:
   Copy `.env.example` to `.env` and fill in your MongoDB connection string and a secret key for JWT.
   ```bash
   cp .env.example .env
   ```
   **Important**: Set `MONGODB_URI` to your actual Atlas connection string.
4. Seed the database (Optional but recommended):
   ```bash
   npm run seed
   ```
   *(Note: Add `"seed": "node scripts/seed.js"` to your server/package.json scripts if not present)*
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *(Note: Add `"dev": "nodemon server.js"` to your server/package.json scripts)*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd fixmyhome/client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create environment variables:
   Copy `.env.example` to `.env` if necessary (defaults to localhost:5000/api).
   ```bash
   cp .env.example .env
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

## Environment Configuration

### Backend (`server/.env`)
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`client/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

## API Documentation

### Authentication (`/api/auth`)
*   `POST /register` - Register a new user (customer/provider).
*   `POST /login` - Login to account.
*   `GET /me` - Get current logged-in user (Protected).

### Services (`/api/services`)
*   `GET /` - List all active services.
*   `GET /:id` - Get service details.
*   `POST /` - Create a new service (Admin).
*   `PUT /:id` - Update service (Admin).
*   `DELETE /:id` - Deactivate service (Admin).

### Bookings (`/api/bookings`)
*   `POST /` - Book a service (Customer).
*   `GET /my` - Get customer's bookings (Customer).
*   `GET /provider/my` - Get provider's assigned jobs (Provider).
*   `GET /:id` - Get booking details (Protected).
*   `PATCH /:id/cancel` - Cancel a booking (Customer).
*   `PATCH /:id/status` - Update job status (Provider/Admin).
*   `PATCH /:id/assign` - Assign provider to job (Admin).

### Reviews (`/api/reviews`)
*   `POST /` - Leave a review for completed booking (Customer).
*   `GET /service/:serviceId` - Get all reviews for a service.

### Admin (`/api/admin`)
*   `GET /dashboard` - Get overall platform statistics (Admin).
*   `GET /users` - List customers (Admin).
*   `GET /providers` - List providers (Admin).
*   `GET /bookings` - List all bookings (Admin).

## Testing Instructions
1. **User Registration & Login**: Go to `/register` and create an account. You can select to register as a Customer or Service Provider.
2. **Booking a Service**: Browse to `/services`, click "View & Book" on a service, select a date/time, and submit.
3. **Customer Dashboard**: Go to Dashboard via the navbar. Check your pending bookings. Try canceling a booking.
4. **Admin Dashboard**: Login using the admin credentials (if you ran the seed script, use `admin@fixmyhome.com` / `password123`). Navigate to the Admin Dashboard to see stats and assign a provider to a booking.
5. **Provider Workflow**: Login as the provider assigned by the admin. Check the Provider Dashboard. Accept the job, then mark it In Progress, and finally Completed.
6. **Reviews**: As a customer, check the completed job on your dashboard and leave a rating/review.

## Deployment Steps

### Backend (Render)
1. Push your code to GitHub.
2. Create a new Web Service on Render.
3. Connect your repository and select the `server` directory as the root.
4. Set Build Command: `npm install`
5. Set Start Command: `node server.js`
6. Add Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (your deployed frontend URL), `NODE_ENV=production`.

### Frontend (Vercel)
1. Create a new Project on Vercel.
2. Connect your repository and select the `client` directory as the root.
3. Vercel will automatically detect Vite and set the build command to `npm run build` and output directory to `dist`.
4. Add Environment Variables: `VITE_API_URL` (your deployed Render backend URL).
5. Deploy.
