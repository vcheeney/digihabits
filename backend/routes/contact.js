const router = require('express').Router();
const checkAuth = require("../middleware/check-auth");

const ContactController = require('../controllers/contact');


/**
 * Connecte l'utilisateur.
 */
router.post("/send", ContactController.send);


module.exports = router;
