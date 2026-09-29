# 🏠 FixMyHome — Full-Stack Home Services Booking Platform

**FixMyHome** is a full-stack home services booking platform designed to make it easy for customers to discover and book reliable home services such as **plumbing, cleaning, AC repair, electrical services, and more**.

The application provides different workflows for **Customers, Service Providers, and Administrators**, making it suitable for a real-world home-service management system.

---

## 👩‍💻 Developed By

### **Pooja Banbhatt**

**MCA — Artificial Intelligence & Data Science**

**Project:** FixMyHome — Full-Stack Home Services Booking Platform

---

## ✨ Features

### 👤 Customer Features

* User registration and login
* Secure JWT authentication
* Browse available home services
* View service details
* Book a service
* Select preferred date and time
* View booking history
* Track booking status
* Cancel bookings
* Submit ratings and reviews for completed services

### 🧑‍🔧 Service Provider Features

* Provider registration and login
* Secure authentication
* View assigned jobs
* Accept assigned bookings
* Update job status
* Manage service requests
* Mark jobs as:

  * Accepted
  * In Progress
  * Completed

### 🛠️ Admin Features

* Admin authentication
* Admin dashboard
* View platform statistics
* Manage customers
* Manage service providers
* View all bookings
* Create services
* Update services
* Deactivate services
* Assign providers to bookings
* Manage booking status

### 🔐 Security Features

* JWT authentication
* Password hashing using bcryptjs
* Role-based authorization
* Protected API routes
* CORS configuration
* Helmet security middleware
* Request validation using express-validator

---

# 🧰 Technology Stack

### Frontend

* React.js
* Vite
* React Router DOM
* Tailwind CSS
* Axios
* Lucide React
* React Hot Toast

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT
* bcryptjs

### Security

* CORS
* Helmet
* express-validator

The project uses React/Vite on the frontend and Node.js/Express with MongoDB Atlas on the backend.

---

# 📁 Project Structure

```text
fixmyhome/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── utils/
│   │
│   ├── .env.example
│   ├── package.json
│   └── tailwind.config.js
│
├── server/
│   ├── scripts/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   │
│   ├── .env.example
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Requirements

Before running the project, install:

* **Node.js v18 or higher**
* **npm**
* **MongoDB Atlas account**

The original project specifies Node.js v18+ and MongoDB Atlas/local MongoDB as prerequisites.

---

# 🚀 Installation & Setup

## 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Move into the project directory:

```bash
cd fixmyhome
```

---

# 🔧 Backend Setup

Open a terminal and navigate to the backend:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

---

## 🔑 Configure Backend Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Example

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fixmyhome
JWT_SECRET=your_strong_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> ⚠️ Never upload your actual `.env` file to GitHub.

The backend environment configuration uses `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, and `NODE_ENV`.

---

# 🌱 Seed Database

If your project contains the seed script, run:

```bash
npm run seed
```

If the `seed` command is missing from `package.json`, add:

```json
{
  "scripts": {
    "seed": "node scripts/seed.js"
  }
}
```

---

# ▶️ Start Backend

Run:

```bash
npm run dev
```

If `npm run dev` is not configured, you can run:

```bash
node server.js
```

Backend will run at:

```text
http://localhost:5000
```

---

# 💻 Frontend Setup

Open a **new terminal**.

Navigate to the frontend:

```bash
cd fixmyhome/client
```

Install dependencies:

```bash
npm install
```

---

# 🔑 Configure Frontend Environment

Create:

```text
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

The frontend configuration in the original project uses `VITE_API_URL` with the local backend API URL.

---

# ▶️ Start Frontend

Run:

```bash
npm run dev
```

Vite will normally provide:

```text
http://localhost:5173
```

Open the URL in your browser.

---

# 🔄 Running the Complete Application

You need **two terminals**.

### Terminal 1 — Backend

```bash
cd fixmyhome/server
npm install
npm run dev
```

Backend:

```text
http://localhost:5000
```

### Terminal 2 — Frontend

```bash
cd fixmyhome/client
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

The frontend communicates with the backend through:

```text
http://localhost:5000/api
```

---

# 🔌 API Documentation

## 🔐 Authentication

Base route:

```text
/api/auth
```

| Method | Endpoint    | Description                |
| ------ | ----------- | -------------------------- |
| POST   | `/register` | Register customer/provider |
| POST   | `/login`    | Login                      |
| GET    | `/me`       | Get logged-in user         |

---

## 🛠️ Services

Base route:

```text
/api/services
```

| Method | Endpoint | Description         |
| ------ | -------- | ------------------- |
| GET    | `/`      | Get active services |
| GET    | `/:id`   | Get service details |
| POST   | `/`      | Create service      |
| PUT    | `/:id`   | Update service      |
| DELETE | `/:id`   | Deactivate service  |

---

## 📅 Bookings

Base route:

```text
/api/bookings
```

| Method | Endpoint       | Description            |
| ------ | -------------- | ---------------------- |
| POST   | `/`            | Book a service         |
| GET    | `/my`          | Customer bookings      |
| GET    | `/provider/my` | Provider assigned jobs |
| GET    | `/:id`         | Booking details        |
| PATCH  | `/:id/cancel`  | Cancel booking         |
| PATCH  | `/:id/status`  | Update job status      |
| PATCH  | `/:id/assign`  | Assign provider        |

---

## ⭐ Reviews

Base route:

```text
/api/reviews
```

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| POST   | `/`                   | Add review          |
| GET    | `/service/:serviceId` | Get service reviews |

---

## 👑 Admin

Base route:

```text
/api/admin
```

| Method | Endpoint     | Description         |
| ------ | ------------ | ------------------- |
| GET    | `/dashboard` | Platform statistics |
| GET    | `/users`     | List customers      |
| GET    | `/providers` | List providers      |
| GET    | `/bookings`  | List bookings       |

These API routes and their documented purposes are taken from your original project README.

---

# 🧪 How to Test the Application

## 1. Register a Customer

Open:

```text
http://localhost:5173/register
```

Create a new account and select:

```text
Customer
```

---

## 2. Register a Service Provider

Create another account and select:

```text
Service Provider
```

---

## 3. Browse Services

Go to:

```text
http://localhost:5173/services
```

Choose a service and click:

```text
View & Book
```

Select the date and time and submit the booking.

---

## 4. Customer Dashboard

Open the customer dashboard to:

* View bookings
* Check booking status
* Cancel bookings
* Review completed services

---

## 5. Admin Dashboard

If you have executed the database seed script, the original project documents the following seeded admin account:

```text
Email: admin@fixmyhome.com
Password: password123
```

> ⚠️ This default credential should only be used for local development/testing. Change or remove it before any public deployment.

The original README documents this account as part of the seeded testing workflow.

---

## 6. Provider Workflow

Login as the assigned provider.

The provider can:

```text
Accept Job
     ↓
In Progress
     ↓
Completed
```

---

## 7. Customer Review

After the service is marked as completed, the customer can submit a rating and review.

---

# 🔄 Application Workflow

```text
                    CUSTOMER
                       │
                       ▼
              Browse Services
                       │
                       ▼
                Book Service
                       │
                       ▼
                    ADMIN
                       │
                       ▼
              Assign Provider
                       │
                       ▼
               SERVICE PROVIDER
                       │
                       ▼
                  Accept Job
                       │
                       ▼
                 In Progress
                       │
                       ▼
                  Completed
                       │
                       ▼
                CUSTOMER REVIEW
```

---

# 🗄️ Database

FixMyHome uses **MongoDB Atlas** as the database.

The backend communicates with MongoDB using **Mongoose**.

The database stores application information required for:

* Users
* Service providers
* Services
* Bookings
* Reviews

---

# 🔐 Security

The application includes several security mechanisms:

* JWT authentication
* Password hashing using bcryptjs
* Protected routes
* Role-based authorization
* CORS
* Helmet
* Input validation
* Environment variables for sensitive configuration

Never commit the following information to GitHub:

```text
MONGODB_URI
JWT_SECRET
Passwords
API keys
Private credentials
```

---

# 📌 Project Highlights

* Full-stack React application
* Vite-powered frontend
* Node.js and Express backend
* MongoDB Atlas integration
* JWT authentication
* Role-based access control
* Customer dashboard
* Provider dashboard
* Admin dashboard
* Home service booking
* Provider assignment
* Booking status management
* Review and rating system
* Responsive UI using Tailwind CSS
* REST API architecture

---

# 🎯 Future Enhancements

Potential future improvements include:

* Online payment integration
* Email notifications
* SMS notifications
* Real-time booking notifications
* Provider availability management
* Advanced search and filtering
* Location-based provider discovery
* AI-based service recommendations
* Price estimation
* Customer support chatbot
* Advanced analytics

---

# 👩‍💻 Author

## Pooja Banbhatt

**MCA — Artificial Intelligence & Data Science**

### Project

**FixMyHome — Full-Stack Home Services Booking Platform**

---

# ⭐ Project Purpose

FixMyHome was developed as a practical full-stack project to demonstrate the implementation of:

* Frontend development
* Backend API development
* Database management
* Authentication and authorization
* REST API integration
* Role-based application workflows
* Full-stack application architecture

---

# 📄 License

This project is developed for **educational, portfolio, and demonstration purposes**.
