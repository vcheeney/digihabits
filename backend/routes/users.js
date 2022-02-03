const router = require('express').Router();
const checkAuth = require("../middleware/check-auth");

const UsersController = require('../controllers/users');

/**
 * Obtenir tous les utilisateur.
 */
router.get('/get', checkAuth, UsersController.getUsers);

/**
 * Ajouter un nouvel utilisateur.
 */
router.post("/signup", UsersController.signupUser);

/**
 * Connecte l'utilisateur.
 */
router.post("/login", UsersController.loginUser);

/**
 * Mettre à jour l'utilisateur.
 */
router.post("/update", checkAuth, UsersController.updateUser);

module.exports = router;
