const express = require('express');
const { getBudget, setBudget } = require('../controllers/budgetController');

const router = express.Router();

router.route('/').get(getBudget).post(setBudget);

module.exports = router;
