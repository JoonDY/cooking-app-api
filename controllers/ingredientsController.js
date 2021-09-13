const db = require('../db');

const indexIngredient = async (req, res) => {
  const userId = req.user.id;
  try {
    const results = await db.query(
      'SELECT * FROM ingredients WHERE user_id = $1 ORDER BY priority DESC',
      [userId]
    );
    res.status(200).json({
      status: 'success',
      results: results.rows.length,
      data: {
        ingredients: results.rows,
      },
    });
  } catch (err) {
    res.json({
      error: err.detail,
    });
  }
};

const singleIngredient = async (req, res) => {
  const userId = req.user.id;
  try {
    const results = await db.query(
      'SELECT * FROM ingredients WHERE id = $1 AND user_id = $2',
      [req.params.id, userId]
    );
    res.json({
      status: 'success',
      results: results.rows.length,
      data: {
        ingredients: results.rows,
      },
    });
  } catch (err) {
    res.json({
      error: err.detail,
    });
  }
};

const createIngredient = async (req, res) => {
  const userId = req.user.id;
  try {
    const { name, category, in_stock, priority } = req.body;
    const results = await db.query(
      'INSERT INTO ingredients (name, category, in_stock, priority, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, category, in_stock, priority, userId]
    );
    res.json({
      status: 'success',
      results: results.rows.length,
      data: {
        ingredients: results.rows,
      },
    });
  } catch (err) {
    res.status(500).json({
      err,
    });
  }
};

const updateIngredient = async (req, res) => {
  const userId = req.user.id;
  try {
    const { name, category, in_stock, priority } = req.body;
    const { id } = req.params;
    const results = await db.query(
      'UPDATE ingredients SET name = $1, category = $2, in_stock = $3, priority = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
      [name, category, in_stock, priority, id, userId]
    );
    res.json({
      status: 'success',
      results: results.rows.length,
      data: {
        ingredients: results.rows,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.detail,
    });
  }
};

const deleteIngredient = async (req, res) => {
  const userId = req.user.id;
  try {
    const results = await db.query(
      'DELETE FROM ingredients WHERE id = $1 AND user_id = $2',
      [req.params.id, userId]
    );
  } catch (err) {
    res.json({
      error: err.detail,
    });
  }
};

module.exports = {
  indexIngredient,
  singleIngredient,
  createIngredient,
  updateIngredient,
  deleteIngredient,
};
