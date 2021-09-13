const express = require('express');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();
const mountRoutes = require('./routes');
const PORT = process.env.PORT || '3001';

// app init
const app = express();
app.listen(PORT, () => {
  console.log(`Server started on Port ${PORT}`);
});

// passport
require('./passport')(passport);
app.use(passport.initialize());

// middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes
mountRoutes(app);

module.exports = app;
