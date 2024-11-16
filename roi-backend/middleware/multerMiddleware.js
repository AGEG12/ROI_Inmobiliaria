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
const fileFilterImg = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
        return cb(null, true);
    }
    cb('Error: Solo se permiten archivos de imagen');
}

const uploadPP = multer({
    storage: storagePP,
    fileFilter: fileFilterImg,
    limits: { fileSize: 5 * 1024 * 1024 }
});


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
    fileFilter: fileFilterImg,
    limits: { fileSize: 5 * 1024 * 1024 },
}).array("images", 12);


const storageTF = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/transaction_files');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});
const fileFilterTF = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Solo se permiten archivos PDF"), false);
    }
};
const uploadTF = multer({
    storage: storageTF,
    fileFilter: fileFilterTF,
    limits: { fileSize: 25 * 1024 * 1024 },
});

module.exports = { uploadPP, uploadPI, uploadTF };