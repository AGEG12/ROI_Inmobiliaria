const express = require('express');
const router = express.Router();

const { registerTransaction, getTransaction, deleteTransaction, updateTransaction, uploadDocument, deleteDocument } = require('./../controllers/transactionController')
const { authenticateToken } = require('../middleware/authMiddleware');
const { uploadTF } = require('../middleware/multerMiddleware');


router.post('/register/:id', authenticateToken, registerTransaction);
router.get('/get/:id', authenticateToken, getTransaction);
router.delete('/delete/:id', authenticateToken, deleteTransaction);
router.put('/update/:id', authenticateToken, updateTransaction);
router.post('/add-document/:id', authenticateToken, uploadTF.single("document"), uploadDocument);
router.delete('/delete-document/:transactionId/document/:filename', authenticateToken, deleteDocument);

module.exports = router;