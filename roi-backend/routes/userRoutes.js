const express = require('express');
const router = express.Router();

const { login, getUser, getProperties, getTransactions, changePassword, updateProfile, deleteProfilePicture, upload } = require('./../controllers/userController')
const { authenticateToken } = require('../middleware/authMiddleware');
const { uploadPP } = require('../middleware/multerMiddleware');


router.post('/login', login);
router.get('/get', authenticateToken, getUser);
router.patch('/change-password', authenticateToken, changePassword);
router.put('/update-profile', authenticateToken, uploadPP.single('image'), updateProfile);
router.delete('/delete-profile-picture', authenticateToken, deleteProfilePicture);


module.exports = router;