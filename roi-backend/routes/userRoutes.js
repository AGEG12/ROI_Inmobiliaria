const express = require('express');
const router = express.Router();

const { getUser, saveUser } = require('./../controllers/userController')

router.get('/', getUser);
router.post('/', saveUser);

module.exports = router;