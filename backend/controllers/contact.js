const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const InformationRequest = require('../models/informationrequest');

/**
 * Connecte l'utilisateur.
 */
exports.send = (req, res, next) => {
  const newMessage = new InformationRequest(req.body);
  newMessage.save((error, savedMessage) => {
    if (error) return res.status(500).send(error);

    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'victorcheeney@gmail.com',
        pass: 'ywbpmcfsmfbzgxby'
      }
    });

    /**
     * Je m'envois un courriel avec les informations du message de mon utilisateur.
     */
    var mailOptions = {
      from: 'victorcheeney@gmail.com',
      to: 'victorcheeney@gmail.com',
      subject: 'J\'ai reçu un nouveau message de '+savedMessage.firstname+' '+savedMessage.lastname+' ('+savedMessage.email+')',
      text: 'Type de message: '+savedMessage.messageType+' Message: '+savedMessage.message
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });


    /**
     * J'envois un courriel a l'utilisateur pour lui confirmer que son message a bien été reçu.
     * (Je vais trouver une meilleure manière de procéder bientôt car pour l'instant les gens vont recevoir un email de mon courriel personnel.)
     */
    var mailOptions = {
      from: 'digihabits',
      to: savedMessage.email,
      subject: 'digihabits: Nous avons bien reçu votre message',
      text: 'Bonjour! Nous avons bien reçu votre message, nous prendrons connaissance de votre message dans les plus brefs délais.'
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });


    res.status(200).json({
      message: 'Le message a bien été envoyé.'
    });
  });
};
