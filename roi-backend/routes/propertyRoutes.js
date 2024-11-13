const express = require('express');
const router = express.Router();

const { addProperty, upload } = require('./../controllers/propertyController')
const { authenticateToken } = require('../middleware/authMiddleware');


router.post('/add', authenticateToken, addProperty);


module.exports = router;