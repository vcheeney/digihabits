const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

var ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = mongoose.Schema({
  nom: { type: String, trim: true },
  prenom: { type: String, trim: true },
  email: { type: String, required: true, unique: true },
  role: { type: String },
  /*
    "unique" contrairement à "required" ne fait pas de validation,
    il ne sert qu'à optimiser. Pour valider si le courriel d'un nouvel
    utilisateur est unique, on va devoir procéder différamment.
  */
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);
/*
  Cette ligne permet de vérifier que l'email est bien unique. Il s'agit d'un plugin
  installé dans le projet avec: "npm install --save mongoose-unique-validator"
*/

module.exports = mongoose.model('User', userSchema);
