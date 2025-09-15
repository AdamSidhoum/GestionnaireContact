const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/User');
const contactRoutes = require('./routes/Contact');
const setupSwagger = require('./swagger');

const uri = "mongodb+srv://adamsidhoumpro_db_user:Password91@cluster0.iikgpns.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri) 
.then(() => console.log('Connexion à MongoDB réussie !')) 
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express(); 

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/contact', contactRoutes);
app.use('/auth', userRoutes);

setupSwagger(app);

module.exports = app;
