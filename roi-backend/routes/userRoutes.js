const express = require('express');
const router = express.Router();

const { login, changePassword, updateProfile, upload } = require('./../controllers/userController')
const { authenticateToken } = require('../middleware/authMiddleware');
const { uploadPP } = require('../middleware/multerMiddleware');


router.post('/login', login);
router.patch('/change-password', authenticateToken, changePassword);
router.put('/update-profile', authenticateToken, uploadPP.single('image'), updateProfile);


module.exports = router;