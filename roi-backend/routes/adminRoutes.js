const express = require('express');
const router = express.Router();

const { getUsers, getProperties, getTransactions, createUser, updateUser, deleteUser } = require('./../controllers/adminController')
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');
const { uploadPP } = require('../middleware/multerMiddleware');

router.get('/get-users', authenticateToken, authorizeAdmin, getUsers);
router.get('/get-properties', authenticateToken, authorizeAdmin, getProperties);
router.get('/get-transactions', authenticateToken, authorizeAdmin, getTransactions);
router.post('/create-user', authenticateToken, authorizeAdmin, uploadPP.single('image'), createUser);
router.put('/update-user/:id', authenticateToken, authorizeAdmin, uploadPP.single('image'), updateUser);
router.delete('/delete-user/:id', authenticateToken, authorizeAdmin, deleteUser);

module.exports = router;