const express = require('express');
require('dotenv').config();
const app = express();

app.use(express.json());

const authRoutes = require('./routes/auth.route');
app.use('/authentification', authRoutes);

const orderRoutes = require('./routes/order.route');
app.use('/commandes', orderRoutes)

const avisRoutes = require('./routes/avis.route');
app.use('/avis', avisRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Service Auth lancé sur le port ${PORT}`);
});
   