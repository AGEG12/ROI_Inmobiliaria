const express = require('express');
const router = express.Router();

const { createUser, updateUser, deleteUser, dashboard, upload } = require('./../controllers/adminController')
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, authorizeAdmin, dashboard);
router.post('/', authenticateToken, authorizeAdmin, upload.single('image'), createUser);
router.put('/:id', authenticateToken, authorizeAdmin, upload.single('image'), updateUser);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteUser);

module.exports = router;