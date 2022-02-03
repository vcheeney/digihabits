const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

/**
 * Importation du package qui va rediriger les gens vers mon lien sécurisé HTTPS
 */
// var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;

/**
 * Importation des fichiers de routes.
 */
const usersRoutes = require('./routes/users');
const habitsRoutes = require('./routes/habits');
const contactRoutes = require('./routes/contact');

/**
 * Importation des scrips.
 */
require('./scripts/habitscheck');

const app = express();

// Don't redirect if the hostname is `localhost:port` or the route is `/insecure`
// app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));


// Les deux lignes suivantes nous permettent d'éviter les messages de "deprecations" https://mongoosejs.com/docs/deprecations.html.
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

/**
 * Connexion à la BD mongo.
 */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(err => {
    console.log(err);
  });

/**
 * Middleware qui rend le "req" facilement utilisable dans nos requêtes.
 * C'est lui qui nous permet d'accéder à "req.body.email" par exemple.
 * Il s'agit d'un middleware appliqué à toutes les requêtes entrantes.
 */
app.use(bodyParser.json());

// VC: On doit ajouter ce middleware car autrement l'application compilée nous retourne trois erreurs et empêche l'application de fonctionner.
app.use('/', express.static(path.join(__dirname, 'public')));

/**
 * Middleware qui ajoute les droits CORS (Cross-Origin Resource Sharing)
 * Middleware appliqué à toutes les requêtes entrantes.
 */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next(); // Le next() indique à la requête de poursuivre à la prochaine méthode.
});

/**
 * Association des chemins aux bons fichiers de routes
 */
app.use('/api/users', usersRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/contact', contactRoutes);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
