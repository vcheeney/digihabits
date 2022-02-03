const schedule = require('node-schedule');

// Importation des modèles
const Habit = require('../models/habit');

// const checkHabits = schedule.scheduleJob('0 0 * * * *', executionDate => {
//   console.log(executionDate);

  // var nodemailer = require('nodemailer');

  // var transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: 'victorcheeney@gmail.com',
  //     pass: 'ywbpmcfsmfbzgxby'
  //   }
  // });

  // var mailOptions = {
  //   from: 'victorcheeney@gmail.com',
  //   to: 'victorcheeney@gmail.com',
  //   subject: 'Mon serveur est encore live! (' + executionDate.getHours()+"h)",
  //   text: 'That was easy!'
  // };

  // transporter.sendMail(mailOptions, function(error, info) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log('Email sent: ' + info.response);
  //   }
  // });
// });
