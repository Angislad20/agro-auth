const express = require('express');
const app = express();
require('dotenv').config();

const { connectProducer } = require('./kafka/producer');
connectProducer();

const PORT = process.env.PORT || 3000;

// Routes
const authRoutes = require('./routes/auth.route');

// Middlewares
app.use(express.json());
app.use('/authentification', authRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`✅ Service Authentification lancé sur le port ${PORT}`);
  console.log('SUPABASE_DATABASE_URL:', process.env.SUPABASE_DATABASE_URL);

});
