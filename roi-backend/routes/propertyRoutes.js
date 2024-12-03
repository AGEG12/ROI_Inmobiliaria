const express = require('express');
const router = express.Router();

const { addProperty, getProperties ,getProperty, updateProperty, deleteProperty, addImages, deleteImage } = require('./../controllers/propertyController')
const { authenticateToken } = require('../middleware/authMiddleware');


router.post('/add', authenticateToken, addProperty);
router.get('/get/properties', authenticateToken, getProperties);
router.get('/get/:id', authenticateToken, getProperty);
router.put('/update/:id', authenticateToken, updateProperty);
router.delete('/delete/:id', authenticateToken, deleteProperty);

router.post('/add-images/:id', authenticateToken, addImages);
router.delete('/delete-image/:propertyId/image/:imageName', authenticateToken, deleteImage);




module.exports = router;