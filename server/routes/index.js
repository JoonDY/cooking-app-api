const ingredients = require('./ingredientsRoute');
const user = require('./usersRoute');

module.exports = (app) => {
  app.use('/api/v1/ingredients', ingredients);
  app.use('/auth', user);
};
