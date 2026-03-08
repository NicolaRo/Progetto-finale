//Importo Express
const express = require("express");

//Importo mongoSanitize per proteggere da attacchi No-SQL-Injection
const mongoSanitize = require('express-mongo-sanitize');

//Importo la funzione di connessione al database
const connectDB =require('./database');

//Carica le variabili d'ambiente da .env per tenere al sicuro le key ed altri dati sensibili
require("dotenv").config();

//Chiamo la funzione  di connessione prima diavviare il server
connectDB();

//Crea l'applicazione Express
const app = express();

//--- MIDDLEWARE ---
//1. Parse JSON nel body delle richieste
app.use(express.json());

//2. Protezione NoSQL Injection
app.use(mongoSanitize({
  onSanitize: ({req, key}) => {
    console.warn(`⚠️ Tentativo NoSQL Injection rilevato in : ${key}`);
  },
}));

//3. Logging semplice per debug
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

//Importo i middleware
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');



//Importo le routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require ('./routes/orderRoutes');
const containerRoutes = require('./routes/containerRoutes');


//Uso le routes
app.use('/api/users', authMiddleware, roleMiddleware, userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/containers', containerRoutes);
app.use('/api/orders', authMiddleware, roleMiddleware, orderRoutes);

//Creo la porta d'ascolto del server
const PORT = process.env.PORT || 3000;

//Avvio l'ascolto sulla porta PORT indicata
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// --- ERROR HANDLING ---

//Error handler generico
app.use((err, req, res, next) => {
  console.error('Errore', err.message);

  res.status(err.status || 500).json({
    error: err.message || 'Errore interno del server',
    ...(process.env.NODE_ENV === 'development' && {stack: err.stack})
  });
});

//Esporto l'app (verrà usata in index.js)
module.exports = app; 