const Habit = require('../models/habit');

/**
 * Obtenir toutes les habitudes.
 */
exports.getAll = (req, res, next) => {
  Habit.find((error, habits) => {
    if (error) return res.status(500).send(error);
    return res.status(200).send(habits);
  });
};

/**
 * Obtenir toutes les habitudes d'un user.
 */
exports.getHabitsByUserId = (req, res, next) => {
  Habit.find(
    {
      user_id: req.params.userId
    },
    (error, habits) => {
      if (error) return res.status(500).send(error);
      return res.status(200).json({
        habits: habits
      });
    }
  );
};

/**
 * Ajouter une habitude.
 */
exports.add = (req, res, next) => {

  if (req.userData.role === 'demo') {
    return res.status(401).json({
      message: "Vous ne pouvez pas ajouter d'habitudes sur le compte démo."
    });
  }

  req.body.user_id = req.userData.userId;

  const newHabit = new Habit(req.body);

  var nodemailer = require('nodemailer');

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'victorcheeney@gmail.com',
      pass: 'ywbpmcfsmfbzgxby'
    }
  });

  newHabit.save((error, habit) => {
    if (error) return res.status(500).send(error);
    return res.status(200).send(habit);
  });
};

/**
 * Supprimer une habitude.
 */
exports.delete = (req, res, next) => {

  if (req.userData.role === 'demo') {
    return res.status(401).json({
      message: "Vous ne pouvez pas supprimer d'habitudes sur le compte démo."
    });
  }

  const habit_id = req.body.habit_id;
  Habit.deleteOne({ _id: habit_id }, (error, response) => {
    if (error) return res.status(500).send(error);
    res.status(200).json({
      message: "L'habitude a bien été supprimée.",
      response: response
    });
  });
};

/**
 * Ajouter/Retirer une date "fait" à une habitude.
 */
exports.toggleDate = (req, res, next) => {
  // On définit notre date d'aujourd'hui car on veut la comparer avec la date obtenue pour empêcher les gens d'utiliser des techniques avancées pour changer leurs anciennes dates.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const achievedDate = new Date(req.body.date);
  achievedDate.setHours(0, 0, 0, 0);

  if (today.getTime() === achievedDate.getTime()) {
    Habit.findOne({ _id: req.body.habit_id }, (error, habit) => {
      if (error) return res.status(500).send(error);

      habit.achievedDates.forEach(date => {
        if (date.getTime() === achievedDate.getTime()) {
          habit.achievedDates.splice(habit.achievedDates.indexOf(date), 1);
        }
      });

      if (req.body.checked) {
        habit.achievedDates.push(achievedDate);
      }

      habit.save((error, response) => {
        if (error) return res.status(500).send(error);
        res.status(200).json({
          message: 'La date a bien été mise à jour.'
        });
      });
    });
  } else {
    res.status(500).json({
      message: "Vous n'êtes pas autorisé à modifier une date différente de la date d'aujourd'hui"
    });
  }
};
