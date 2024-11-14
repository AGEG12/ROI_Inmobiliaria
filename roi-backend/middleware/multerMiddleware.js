const multer = require('multer');
const path = require('path');

const storagePP = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile_pictures/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const uploadPP = multer({ storage: storagePP });

const storagePI = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/property_images');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const uploadPI = multer({
    storage: storagePI,
    limits: { fileSize: 5 * 1024 * 1024 },
}).array("images", 12);

module.exports = { uploadPP, uploadPI };