🏙️ Smart City Management Platform
A comprehensive, full-stack web application for monitoring and managing urban infrastructure in real-time. This platform provides a centralized dashboard for visualizing data related to traffic, energy, environment, and citizen services, complete with an interactive map and alert system.

✨ Key Features
📊 Real-time Dashboard: A central hub displaying live metrics for key city operations, including traffic congestion, air quality, energy consumption, and water quality.

📈 Advanced Data Visualization: Interactive charts and graphs that provide historical trends and current status for all monitored systems (powered by Recharts).

🗺️ Interactive Live Map: A live map (powered by Leaflet) that visualizes the real-time locations of system alerts, citizen requests, and waste management statuses.

🔔 Alert Management System: A dedicated section for viewing and managing system-generated alerts, categorized by priority (critical, high, medium, low).

👤 User Authentication & Roles: A secure JWT-based authentication system with distinct user roles (Admin, Operator, Citizen, Viewer) and permissions.

** citizen️ Citizen Services Portal:** A module for citizens to submit service requests and for operators to track them.

🛠️ Tech Stack
This project is a MERN-stack application, built with modern tools for both the frontend and backend.

Area

Technology

Frontend

React (with Vite), Tailwind CSS, Recharts, React-Leaflet

Backend

Node.js, Express, MongoDB (with Mongoose), JWT for Auth

Deployment

(Ready for services like Vercel, Netlify, Heroku, or any cloud provider)

🚀 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites

Node.js (v16 or later recommended)

npm or yarn package manager

A free MongoDB Atlas account for the database.

1. Backend Setup

First, clone the repository and navigate into the project directory that contains server.js.

git clone [https://github.com/Resham-29/smart-city-platform.git](https://github.com/Resham-29/smart-city-platform.git)
cd smart-city-platform # Or your backend folder

Install dependencies:

npm install

Create a .env file in the backend's root directory and add your MongoDB connection string and a JWT secret.

# .env

# Your MongoDB connection string from Atlas
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"

# A secure secret for JWT token generation
JWT_SECRET="your-super-secret-key-for-jwt"

# The URL where your frontend is running
CLIENT_URL="http://localhost:5173"

Run the server:

npm start

The backend API will be running on http://localhost:5000.

2. Frontend Setup

In a new terminal, navigate into your frontend project directory.

Install dependencies:

npm install

Run the development server:

npm run dev

The frontend application will be available at http://localhost:5173.

🔑 Demo Credentials

The backend automatically creates two users upon its first launch. You can use these to log in:

Administrator:

Username: admin

Password: admin123

Viewer:

Username: demo

Password: demo123

📁 Project Structure
The project is organized into a standard full-stack structure with separate directories for frontend and backend logic.

/smart-city-platform
├── server.js               # Main backend server file
├── package.json            # Backend dependencies
└── /src                    # Frontend application source
    ├── /components         # React components (Dashboard, Auth, Map, etc.)
    ├── App.jsx             # Main application component with routing/context
    ├── main.jsx            # Entry point for the React app
    └── index.css           # Tailwind CSS setup




