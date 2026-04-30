//Import Express
const express = require("express");

//Import mongoSanitize to defend from No-SQL-Injection attacks
const mongoSanitize = require('express-mongo-sanitize');

//Import DB connection function
const connectDB =require('./database');

//Load .env variables to keep keys and sensible data safe
require("dotenv").config();

//Call connecting function before starting the server
connectDB();

//Create Express app
const app = express();

//--- MIDDLEWARE ---
//1. Parse JSON applied to the queries body
app.use(express.json());

//2. NoSQL Injection protection
app.use(mongoSanitize({
  onSanitize: ({req, key}) => {
    console.warn(`⚠️ Attempted NoSQL Injection attack to : ${key}`);
  },
}));

//3. Logging to debug
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

//Import middleware
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');

//Import cors
const cors = require ('cors');

//Import the routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require ('./routes/orderRoutes');
const containerRoutes = require('./routes/containerRoutes');

//Configure Cors
app.use(cors({
  origin: 'http://localhost:5173/'
}));

/* app.use('/api/users', authMiddleware, roleMiddleware, userRoutes); */
app.use('/api/products', productRoutes);
app.use('/api/containers', containerRoutes);
/* app.use('/api/orders', authMiddleware, roleMiddleware, orderRoutes); */

//Server port
const PORT = process.env.PORT || 3000;

//Started lissening on port 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// --- ERROR HANDLING ---

//Error handler
app.use((err, req, res, next) => {
  console.error('Errore', err.message);

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && {stack: err.stack})
  });
});

module.exports = app; 