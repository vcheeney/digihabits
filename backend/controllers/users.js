const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

/**
 * Obtenir tous les utilisateur.
 */
exports.getUsers = (req, res, next) => {
  User.find({}, function(err, users) {
    if (err) return console.error(err);
    res.json(users);
  });
};

/**
 * Enregistre un nouvel utilisateur.
 */
exports.signupUser = (req, res, next) => {
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      return res.status(401).json({
        message: 'Le courriel a déjà été utilisé.'
      });
    }
    bcrypt.hash(req.body.password, 10).then(hash => {
      // 10 ici est le coût de hashage (Plus c'est haut, plus c'est long)
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user
        .save()
        .then(result => {
          res.status(201).json({
            message: 'User created!',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            message: err.message
          });
        });
    });
  });
};

/**
 * Connecte l'utilisateur.
 */
exports.loginUser = (req, res, next) => {
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (!user) {
      return res.status(401).json({
        message: "Aucun utilisateur n'est inscrit avec cette adresse courriel."
      });
    }
    return bcrypt
      .compare(req.body.password, user.password)
      .then(result => {
        if (!result) {
          return res.status(401).json({
            message: 'Le mot de passe est erroné.'
          });
        }

        const token = jwt.sign(
          {
            // jwt = JsonWebToken
            email: user.email,
            userId: user._id,
            role: user.role
          },
          process.env.JWT_KEY,
          {
            expiresIn: '1h'
          }
        );

        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'victorcheeney@gmail.com',
            pass: 'ywbpmcfsmfbzgxby'
          }
        });

        // Il est important d'enlever le champ password avant de retourner les informations de l'usager.
        user.password = undefined;
        res.status(200).json({
          message: 'Authentification réussi',
          token: token,
          expiresIn: 3600,
          userId: user._id,
          user: user
        });
      })
      .catch(error => {
        console.log(error);
        return res.status(401).json({
          message: 'Invalid authentication credentials'
        });
      });
  });
};

/**
 * Met à jour les données de l'utilisateur
 */
exports.updateUser = (req, res, next) => {
  if (req.userData.role === 'demo') {
    return res.status(401).json({
      message: "Vous ne pouvez pas modifier les paramètres de l'usager démo."
    });
  }

  if (req.body.email === '') {
    return res.status(401).json({
      message: "Le courriel est requis."
    });
  }



  User.updateOne(
    {
      _id: req.body._id
    },
    req.body,
    (error, response) => {
      if (error)
        return res.status(500).json({
          error: error
        });

      if (response.nModified)
        return res.status(200).json({
          message: 'La mise à jour à été effectuée avec succès.',
          response: response
        });

      res.status(200).json({
        message: "Le user n'a pas été modifié.",
        response: response
      });
    }
  );
};
