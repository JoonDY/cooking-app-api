const db = require('../db');
const utils = require('../util/utils');

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw 'Invalid information';
    }

    const result = await db.query('SELECT * FROM users WHERE username=$1', [
      username.toLowerCase(),
    ]);

    const user = result.rows[0];

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const valid = utils.validatePassword(password, user.hash, user.salt);

    if (valid) {
      const jwt = utils.issueJWT(user);
      res.status(200).json({
        success: true,
        user: user,
        token: jwt.token,
        expiresIn: jwt.expires,
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.log(err);
  }
};

const signupUser = async (req, res) => {
  try {
    const { username, password, email, passwordConfirm } = req.body;

    if (!username.trim()) {
      throw 'Username required';
    } else if (username.length < 2) {
      throw 'Username needs to be greater than 2 characters';
    }

    if (!email) {
      throw 'Email required';
    } else if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      throw 'Email invalid';
    }

    if (!password) {
      throw 'Password required';
    } else if (password.length < 6) {
      throw 'Password needs to be more than 6 characters';
    }

    if (passwordConfirm !== password || passwordConfirm === '') {
      throw 'Passwords do not match';
    }

    const saltHash = utils.genPassword(password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const results = await db.query(
      'INSERT INTO users (email, salt, hash, date_created, username) VALUES ($1, $2, $3, NOW(), $4) RETURNING *',
      [email.toLowerCase(), salt, hash, username.toLowerCase()]
    );

    const user = results.rows[0];

    const jwt = utils.issueJWT(user);

    res.status(200).json({
      success: true,
      user: user,
      token: jwt.token,
      expiresIn: jwt.expires,
    });
  } catch (err) {
    if (err.constraint === 'unique_email') {
      res.status(500).json({
        error: 'Email already exists',
      });
    } else if (err.constraint === 'users_username_key') {
      res.status(500).json({
        error: 'Username already exists',
      });
    } else {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    }
  }
};

module.exports = {
  loginUser,
  signupUser,
};
