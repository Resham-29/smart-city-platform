Smart City Management Platform
<<<<<<< HEAD

A full-stack, real-time dashboard for monitoring and managing urban infrastructure and public services. This platform integrates data from various city systems to provide actionable insights for traffic management, energy optimization, environmental monitoring, and more.
=======
A full-stack, real-time dashboard for monitoring and managing urban infrastructure and public services. This platform integrates data from various city systems to provide actionable insights for traffic management, energy optimization, and environmental monitoring.
>>>>>>> d879458 (feat: Overhaul UI with new dashboard, tabs, and enhanced charts)

🌟 Key Features
Real-time Monitoring: A dynamic, multi-tabbed dashboard displaying live metrics for traffic, air quality, energy consumption, and water management.

Advanced Analytics: A dedicated analytics tab with detailed charts and historical data trends for deeper insights into city operations.

Professional UI/UX: A clean, organized interface with a sidebar for navigating between different management sections (Overview, Analytics, Alerts, etc.).

<<<<<<< HEAD
User Authentication & Roles: Secure JWT-based authentication with a professional login/registration page and support for different user roles (Admin, Operator, Citizen, Viewer).
=======
User Authentication & Roles: Secure JWT-based authentication with a professional login/registration page and support for different user roles.
>>>>>>> d879458 (feat: Overhaul UI with new dashboard, tabs, and enhanced charts)

Live Alerts System: A real-time panel for viewing and acknowledging active system alerts based on priority.

🛠️ Tech Stack
Frontend

React.js: A powerful JavaScript library for building user interfaces.

Vite: A lightning-fast frontend build tool.

Tailwind CSS: A utility-first CSS framework for rapid UI development.

Recharts: A composable charting library for data visualization.

<<<<<<< HEAD
React Leaflet: React components for interactive Leaflet maps.

=======
>>>>>>> d879458 (feat: Overhaul UI with new dashboard, tabs, and enhanced charts)
Axios: A promise-based HTTP client for making API requests.

Lucide React: A beautiful and consistent icon library.

Backend

Node.js: A JavaScript runtime for building the server-side application.

Express.js: A minimal and flexible Node.js web application framework.

<<<<<<< HEAD
MongoDB: A NoSQL database for storing all application data, connected via Mongoose ODM.
=======
MongoDB: A NoSQL database for storing all application data.
>>>>>>> d879458 (feat: Overhaul UI with new dashboard, tabs, and enhanced charts)

Mongoose: An Object Data Modeling (ODM) library for MongoDB and Node.js.

JSON Web Tokens (JWT): For securing API endpoints and managing user sessions.

<<<<<<< HEAD
bcrypt.js: For hashing user passwords before storing them.

🚀 Getting Started
Follow these instructions to get a local copy of the project up and running for development and testing.
=======
bcrypt.js: For hashing user passwords.

🚀 Getting Started
Follow these instructions to get a local copy of the project up and running.
>>>>>>> d879458 (feat: Overhaul UI with new dashboard, tabs, and enhanced charts)

Prerequisites

Node.js (v18 or newer recommended)

npm (comes with Node.js)

Git for version control

Installation & Setup

Clone the Repository

git clone [https://github.com/Resham-29/smart-city-platform.git](https://github.com/Resham-29/smart-city-platform.git)
cd smart-city-platform

Setup the Backend

<<<<<<< HEAD
Navigate to the backend directory:

cd backend

Install the dependencies:

npm install

Create a .env file in the backend directory and add the following, replacing the placeholder with your MongoDB connection string:

PORT=5001
MONGODB_URI="mongodb+srv://smartcityuser:iIQnktnaklTGRU7n@cluster0.gdpg8f2.mongodb.net/smartcity?retryWrites=true&w=majority&appName=Cluster0"
JWT_SECRET=my_super_secret_key_12345R
=======
Navigate to the backend directory: cd backend

Install dependencies: npm install

Create a .env file and add your configuration:

PORT=5001
MONGODB_URI="your_mongodb_connection_string"
JWT_SECRET="a_very_secret_key_for_jwt"
>>>>>>> d879458 (feat: Overhaul UI with new dashboard, tabs, and enhanced charts)
CLIENT_URL="http://localhost:5173"

Setup the Frontend

<<<<<<< HEAD
Navigate to the frontend directory from the root:

cd frontend

Install the dependencies:

npm install

Create a .env file in the frontend directory with the following content:
=======
Navigate to the frontend directory: cd ../frontend

Install dependencies: npm install

Create a .env file with the following content:
>>>>>>> d879458 (feat: Overhaul UI with new dashboard, tabs, and enhanced charts)

VITE_API_BASE_URL="http://localhost:5001/api"

Running the Application

You need to run the backend and frontend servers in two separate terminals.

<<<<<<< HEAD
Start the Backend Server

In a terminal at the backend directory, run:

npm start

The server should be running at http://localhost:5001.

Start the Frontend Development Server

In a second terminal at the frontend directory, run:

npm run dev

The application will be available at http://localhost:5173.

Demo Credentials

You can use the default accounts created by the server on its first run:

=======
Start the Backend Server (from the /backend folder)

npm start

Start the Frontend Server (from the /frontend folder)

npm run dev

Demo Credentials

>>>>>>> d879458 (feat: Overhaul UI with new dashboard, tabs, and enhanced charts)
Username: demo / Password: demo123 (Role: Viewer)

Username: admin / Password: admin123 (Role: Admin)

📂 Project Structure
smart-city-platform/
├── backend/
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        │   ├── AuthComponent.jsx
<<<<<<< HEAD
        │   ├── CityMap.jsx
=======
>>>>>>> d879458 (feat: Overhaul UI with new dashboard, tabs, and enhanced charts)
        │   ├── Dashboard.jsx
        │   └── enhancedCharts.jsx
        └── App.jsx

<<<<<<< HEAD
=======
