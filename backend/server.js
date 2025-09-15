const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

// const notificationRoutes = require('./routes/notifications.js');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}));
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:5173',
];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// app.use('/api/notifications', notificationRoutes);


// Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

// ... (The rest of your server.js file remains exactly the same) ...
// Schemas, Models, Other Routes, etc.

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  name: { type: String, required: true, trim: true },
  role: {
    type: String,
    enum: ['admin', 'operator', 'viewer', 'citizen'],
    default: 'viewer'
  },
  permissions: [{ type: String }],
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// City Data Schema for real-time monitoring
const cityDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  // == NEW FIELD FOR MAP CENTER ==
  location: {
    lat: Number,
    lng: Number
  },
  traffic: {
    congestion: Number,
    avgSpeed: Number,
    accidents: Number,
    activeSignals: Number
  },
  energy: {
    totalConsumption: Number,
    renewableGeneration: Number,
    solarOutput: Number,
    windOutput: Number,
    gridEfficiency: Number
  },
  airQuality: {
    aqi: Number,
    pm25: Number,
    pm10: Number,
    ozone: Number,
    status: String,
    trend: String
  },
  water: {
    quality: Number,
    pressure: Number,
    consumption: Number,
    leaks: Number,
    treatmentPlants: Number
  },
  waste: [{
    area: String,
    level: Number,
    status: String,
    lastCollection: Date,
    nextCollection: Date,
    // == NEW FIELD FOR MAP MARKERS ==
    coordinates: {
      lat: Number,
      lng: Number
    }
  }],
  infrastructure: {
    streetLights: {
      total: Number,
      active: Number,
      energySaved: Number
    },
    parking: {
      total: Number,
      occupied: Number,
      revenue: Number
    },
    wifi: {
      hotspots: Number,
      activeUsers: Number,
      uptime: Number
    },
    cctv: {
      total: Number,
      active: Number,
      incidents: Number
    }
  }
});

// Alert Schema
const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['critical', 'warning', 'info'],
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Traffic', 'Energy', 'Environment', 'Water', 'Waste', 'Security', 'Emergency']
  },
  message: { type: String, required: true },
  // == UPDATED FIELD FOR MAP MARKERS ==
  location: {
    description: String,
    lat: Number,
    lng: Number
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['active', 'acknowledged', 'resolved'],
    default: 'active'
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Citizen Request Schema
const citizenRequestSchema = new mongoose.Schema({
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    required: true,
    enum: ['Pothole Repair', 'Street Light Issue', 'Noise Complaint', 'Park Maintenance',
           'Traffic Signal Problem', 'Waste Collection', 'Water Issue', 'Other']
  },
  description: { type: String, required: true },
  location: { type: String, required: true },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Emergency'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  images: [String],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: String,
    timestamp: { type: Date, default: Date.now }
  }],
  estimatedResolution: Date,
  actualResolution: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Emergency Incident Schema
const emergencySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Fire', 'Medical', 'Police', 'Natural Disaster', 'Infrastructure', 'Security']
  },
  severity: {
    type: String,
    enum: ['Minor', 'Major', 'Critical', 'Catastrophic'],
    required: true
  },
  location: { type: String, required: true },
  coordinates: {
    lat: Number,
    lng: Number
  },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['Active', 'Responding', 'Under Control', 'Resolved'],
    default: 'Active'
  },
  unitsDispatched: [{
    type: { type: String, enum: ['Police', 'Fire', 'Medical', 'Utility'] },
    unitId: String,
    dispatchTime: Date,
    arrivalTime: Date,
    status: String
  }],
  evacuationRequired: { type: Boolean, default: false },
  publicAlert: { type: Boolean, default: false },
  estimatedDuration: String,
  actualDuration: String,
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Analytics Schema
const analyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  metrics: {
    totalUsers: Number,
    systemUptime: Number,
    alertsGenerated: Number,
    alertsResolved: Number,
    citizenRequests: Number,
    emergencyIncidents: Number,
    energyEfficiency: Number,
    trafficFlowOptimization: Number,
    airQualityImprovement: Number,
    wasteCollectionEfficiency: Number
  },
  predictions: [{
    category: String,
    prediction: String,
    confidence: Number,
    timeframe: String
  }],
  recommendations: [{
    category: String,
    recommendation: String,
    priority: String,
    estimatedImpact: String
  }]
});

// Create Models
const User = mongoose.model('User', userSchema);
const CityData = mongoose.model('CityData', cityDataSchema);
const Alert = mongoose.model('Alert', alertSchema);
const CitizenRequest = mongoose.model('CitizenRequest', citizenRequestSchema);
const Emergency = mongoose.model('Emergency', emergencySchema);
const Analytics = mongoose.model('Analytics', analyticsSchema);

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'smart-city-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Permission Middleware
const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (req.user.permissions.includes('all') || req.user.permissions.includes(requiredPermission)) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
};

// Routes

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, isActive: true });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        permissions: user.permissions
      },
      process.env.JWT_SECRET || 'smart-city-secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, name, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Set permissions based on role
    const rolePermissions = {
      admin: ['all'],
      operator: ['view', 'alerts', 'emergency'],
      viewer: ['view'],
      citizen: ['citizen']
    };

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      username,
      password: hashedPassword,
      name,
      role: role || 'viewer',
      permissions: rolePermissions[role] || ['view']
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// City Data Routes
app.get('/api/city-data', authenticateToken, checkPermission('view'), async (req, res) => {
  try {
    let latestData = await CityData.findOne().sort({ timestamp: -1 });

    if (!latestData) {
      // Generate and save mock data if none exists
      const mockData = generateMockCityData();
      const cityData = new CityData(mockData);
      await cityData.save();
      latestData = cityData;
    }

    res.json(latestData);
  } catch (error) {
    console.error('City data error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/city-data', authenticateToken, checkPermission('all'), async (req, res) => {
  try {
    const cityData = new CityData(req.body);
    await cityData.save();
    res.status(201).json(cityData);
  } catch (error) {
    console.error('City data creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Historical data endpoint
app.get('/api/city-data/history', authenticateToken, checkPermission('view'), async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    const historicalData = await CityData.find({
      timestamp: { $gte: startTime }
    }).sort({ timestamp: 1 });

    res.json(historicalData);
  } catch (error) {
    console.error('Historical data error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Alert Routes
app.get('/api/alerts', authenticateToken, checkPermission('view'), async (req, res) => {
  try {
    const { status = 'active', limit = 50 } = req.query;
    const alerts = await Alert.find({ status })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('assignedTo', 'name username');

    res.json(alerts);
  } catch (error) {
    console.error('Alerts fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/alerts', authenticateToken, checkPermission('alerts'), async (req, res) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();

    // Here you could add real-time notification logic (WebSocket, push notifications, etc.)

    res.status(201).json(alert);
  } catch (error) {
    console.error('Alert creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/alerts/:id', authenticateToken, checkPermission('alerts'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };

    if (req.body.status === 'resolved') {
      updateData.resolvedAt = new Date();
    }

    const alert = await Alert.findByIdAndUpdate(id, updateData, { new: true });

    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json(alert);
  } catch (error) {
    console.error('Alert update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Citizen Request Routes
app.get('/api/citizen-requests', authenticateToken, async (req, res) => {
  try {
    const query = req.user.permissions.includes('all')
      ? {}
      : { citizen: req.user.id };

    const requests = await CitizenRequest.find(query)
      .populate('citizen', 'name username')
      .populate('assignedTo', 'name username')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Citizen requests fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/citizen-requests', authenticateToken, checkPermission('citizen'), async (req, res) => {
  try {
    const request = new CitizenRequest({
      ...req.body,
      citizen: req.user.id
    });

    await request.save();
    await request.populate('citizen', 'name username');

    res.status(201).json(request);
  } catch (error) {
    console.error('Citizen request creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Emergency Routes
app.get('/api/emergencies', authenticateToken, checkPermission('emergency'), async (req, res) => {
  try {
    const emergencies = await Emergency.find({ status: { $ne: 'Resolved' } })
      .populate('reportedBy', 'name username')
      .sort({ createdAt: -1 });

    res.json(emergencies);
  } catch (error) {
    console.error('Emergencies fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/emergencies', authenticateToken, checkPermission('emergency'), async (req, res) => {
  try {
    const emergency = new Emergency({
      ...req.body,
      reportedBy: req.user.id
    });

    await emergency.save();

    // Here you could trigger emergency protocols, notifications, etc.

    res.status(201).json(emergency);
  } catch (error) {
    console.error('Emergency creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Analytics Routes
app.get('/api/analytics', authenticateToken, checkPermission('all'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const analytics = await Analytics.find(query).sort({ date: -1 });
    res.json(analytics);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// System Health Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Mock Data Generation Function
function generateMockCityData() {
  const now = new Date();
  const cityCenter = { lat: 19.0760, lng: 72.8777 }; // Mumbai

  return {
    timestamp: now,
    location: cityCenter,
    traffic: {
      congestion: 30 + Math.random() * 40,
      avgSpeed: 35 + Math.random() * 30,
      accidents: Math.floor(Math.random() * 5),
      activeSignals: 150 + Math.floor(Math.random() * 20)
    },
    energy: {
      totalConsumption: 400 + Math.random() * 200,
      renewableGeneration: 150 + Math.random() * 100,
      solarOutput: 60 + Math.random() * 40,
      windOutput: 90 + Math.random() * 60,
      gridEfficiency: 85 + Math.random() * 10
    },
    airQuality: {
      aqi: 50 + Math.random() * 50,
      pm25: 20 + Math.random() * 30,
      pm10: 30 + Math.random() * 40,
      ozone: 70 + Math.random() * 50,
      status: Math.random() > 0.7 ? 'good' : 'moderate',
      trend: Math.random() > 0.5 ? 'improving' : 'stable'
    },
    water: {
      quality: 90 + Math.random() * 8,
      pressure: 70 + Math.random() * 20,
      consumption: 2 + Math.random() * 1,
      leaks: Math.floor(Math.random() * 3),
      treatmentPlants: 3
    },
    waste: [
      {
        area: 'Downtown',
        level: 60 + Math.random() * 30,
        status: 'normal',
        lastCollection: new Date(Date.now() - 4 * 60 * 60 * 1000),
        nextCollection: new Date(Date.now() + 8 * 60 * 60 * 1000),
        coordinates: { lat: cityCenter.lat + (Math.random() - 0.5) * 0.05, lng: cityCenter.lng + (Math.random() - 0.5) * 0.05 }
      },
      {
        area: 'Suburbs',
        level: 40 + Math.random() * 20,
        status: 'normal',
        lastCollection: new Date(Date.now() - 6 * 60 * 60 * 1000),
        nextCollection: new Date(Date.now() + 18 * 60 * 60 * 1000),
        coordinates: { lat: cityCenter.lat + (Math.random() - 0.5) * 0.1, lng: cityCenter.lng + (Math.random() - 0.5) * 0.1 }
      },
      {
        area: 'Industrial',
        level: 80 + Math.random() * 15,
        status: 'warning',
        lastCollection: new Date(Date.now() - 10 * 60 * 60 * 1000),
        nextCollection: new Date(Date.now() + 2 * 60 * 60 * 1000),
        coordinates: { lat: cityCenter.lat + (Math.random() - 0.5) * 0.2, lng: cityCenter.lng + (Math.random() - 0.5) * 0.2 }
      }
    ],
    infrastructure: {
      streetLights: {
        total: 3000,
        active: 2900 + Math.floor(Math.random() * 80),
        energySaved: 20 + Math.random() * 10
      },
      parking: {
        total: 1800,
        occupied: 800 + Math.floor(Math.random() * 800),
        revenue: 12000 + Math.random() * 8000
      },
      wifi: {
        hotspots: 156,
        activeUsers: 8000 + Math.floor(Math.random() * 2000),
        uptime: 98 + Math.random() * 2
      },
      cctv: {
        total: 245,
        active: 240 + Math.floor(Math.random() * 5),
        incidents: Math.floor(Math.random() * 8)
      }
    }
  };
}

// Automated data generation and cleanup
let dataGenerationInterval;

const startDataGeneration = () => {
  dataGenerationInterval = setInterval(async () => {
    try {
      const mockData = generateMockCityData();
      const cityData = new CityData(mockData);
      await cityData.save();

      // Clean up old data (keep only last 24 hours)
      const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
      await CityData.deleteMany({ timestamp: { $lt: cutoffTime } });

      console.log(`[${new Date().toISOString()}] Generated new city data`);
    } catch (error) {
      console.error('Error generating city data:', error);
    }
  }, 30000); // Every 30 seconds
};

// Error Handling Middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});

// This "catch-all" handler must be the VERY LAST middleware.
// It catches any request that didn't match a route above.
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});


// Graceful shutdown
const gracefulShutdown = () => {
  console.log('Received shutdown signal, closing server...');

  if (dataGenerationInterval) {
    clearInterval(dataGenerationInterval);
  }

  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Initialize Database and Start Server
const startServer = async () => {
  try {
    await connectDB();

    // Create default admin user if none exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      const adminUser = new User({
        username: 'admin',
        password: hashedPassword,
        name: 'System Administrator',
        role: 'admin',
        permissions: ['all']
      });
      await adminUser.save();
      console.log('✅ Default admin user created: admin/admin123');
    }

    // Create demo user
    const demoExists = await User.findOne({ username: 'demo' });
    if (!demoExists) {
      const hashedPassword = await bcrypt.hash('demo123', 12);
      const demoUser = new User({
        username: 'demo',
        password: hashedPassword,
        name: 'Demo User',
        role: 'viewer',
        permissions: ['view']
      });
      await demoUser.save();
      console.log('✅ Demo user created: demo/demo123');
    }

    // == CREATE A MOCK ALERT WITH LOCATION ON STARTUP ==
    const alertExists = await Alert.findOne({ message: 'Major congestion on Marine Drive' });
    if (!alertExists) {
      const cityCenter = { lat: 19.0760, lng: 72.8777 };
      const alert = new Alert({
        type: 'critical',
        category: 'Traffic',
        message: 'Major congestion on Marine Drive',
        location: {
          description: 'Marine Drive, near Wankhede Stadium',
          lat: cityCenter.lat - 0.05,
          lng: cityCenter.lng - 0.08,
        },
        priority: 'high',
        status: 'active'
      });
      await alert.save();
      console.log('✅ Created mock traffic alert.');
    }


    app.listen(PORT, () => {
      console.log(`🚀 Smart City Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Database: Connected to MongoDB Atlas`);

      // Start data generation after server starts
      startDataGeneration();
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

