//Import Express
const express = require("express");

//Import cors
const cors = require ('cors');


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

//Configure Cors
app.use(cors({
  origin: ['http://localhost:5173',
          'https://packback-greengrocery.netlify.app'
  ]
}));

//--- MIDDLEWARE ---
//1. Parse JSON applied to the queries body
app.use(express.json());

//2. NoSQL Injection protection
//NOTE: express-mongo-sanitize's middleware() tries to reassign req.query,
//Use pure sanitize() function only on body/params
//(the only user-controlled inputs that matter for this app's queries).
app.use((req, res, next) => {
  if(req.body) {
    const cleanBody = mongoSanitize.sanitize(req.body);
    if(JSON.stringify(cleanBody) !== JSON.stringify(req.body)){
      console.warn(`Attempted NoSQL Injection attack in body`);
    }
    req.body = cleanBody;
  }
  if(req.params){
    req.params = mongoSanitize.sanitize(req.params);
  }
  next();
})

//3. Logging to debug
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

//Import the routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require ('./routes/orderRoutes');
const containerRoutes = require('./routes/containerRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const aiRoutes = require('./routes/aiRoutes');
const resetPasswordRoutes = require("./routes/resetPasswordRoutes");


app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/containers', containerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/stripe', stripeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/password", resetPasswordRoutes);

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