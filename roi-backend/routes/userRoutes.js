const express = require('express');
const router = express.Router();

const { login, getUser, getUserById, changePassword, updateProfile, deleteProfilePicture, dashboard } = require('./../controllers/userController')
const { authenticateToken } = require('../middleware/authMiddleware');
const { uploadPP } = require('../middleware/multerMiddleware');


router.post('/login', login);
router.get('/get', authenticateToken, getUser);
router.get('/get/:id', authenticateToken, getUserById);
router.patch('/change-password', authenticateToken, changePassword);
router.put('/update-profile', authenticateToken, uploadPP.single('image'), updateProfile);
router.delete('/delete-profile-picture', authenticateToken, deleteProfilePicture);
router.get('/dashboard', authenticateToken, dashboard);


module.exports = router;