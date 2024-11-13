const express = require('express');
const router = express.Router();

const { createAdminUser } = require('./../controllers/devController')

router.post('/', createAdminUser);

module.exports = router;
