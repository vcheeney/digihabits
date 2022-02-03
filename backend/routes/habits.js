const router = require('express').Router();
const checkAuth = require('../middleware/check-auth');

const HabitsController = require('../controllers/habits');

/**
 * Obtenir toutes les habitudes.
 */
router.get('/get', HabitsController.getAll);

/**
 * Obtenir toutes les habitudes d'un user.
 */
router.get('/get/habits/byUserId/:userId', HabitsController.getHabitsByUserId);

/**
 * Ajouter une habitude.
 */
router.post('/add', checkAuth, HabitsController.add);

/**
 * Supprimer une habitude.
 */
router.post('/delete', checkAuth, HabitsController.delete);

/**
 * Toggle une date "fait" à l'habitude dont l'ID est passé dans le body.
 */
router.post('/toggleDate', checkAuth, HabitsController.toggleDate);

// /**
//  * Trigger la vérification des habitudes.
//  */
// router.post('/trigger', checkAuth, HabitsController.trigger);

module.exports = router;
