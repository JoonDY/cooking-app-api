const express = require('express');
const router = express.Router();
const authenticate = require('../util/utils').authenticate;
const ingredients = require('../controllers/ingredientsController');

router.get('/', authenticate, ingredients.indexIngredient);
router.get('/:id', authenticate, ingredients.singleIngredient);
router.post('/', authenticate, ingredients.createIngredient);
router.put('/:id', authenticate, ingredients.updateIngredient);
router.delete('/:id', authenticate, ingredients.deleteIngredient);

module.exports = router;
