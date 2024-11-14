const express = require('express');
const router = express.Router();

const { createUser, updateUser, deleteUser, dashboard } = require('./../controllers/adminController')
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');
const { uploadPP } = require('../middleware/multerMiddleware');

router.get('/', authenticateToken, authorizeAdmin, dashboard);
router.post('/', authenticateToken, authorizeAdmin, uploadPP.single('image'), createUser);
router.put('/:id', authenticateToken, authorizeAdmin, uploadPP.single('image'), updateUser);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteUser);

module.exports = router;