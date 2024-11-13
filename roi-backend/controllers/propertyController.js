const Property = require('../models/Property');
const multer = require('multer');
const path = require('path');

// Configuración del almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/property_images');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
}).array("images", 12);


// Añadir una nueva propiedad con imagenes
const addProperty = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: "Error al cargar las imágenes", error: err });
            }
            const fk_advisor = req.user.id;
            const { type_property, deal, title, description, price, land_area, constructed_meters, location, social_classification_area, features, status, agreed_commission } = req.body;
            const imagePaths = req.files.map(file => file.path);
            const newProperty = new Property({
                type_property,
                deal,
                title,
                description,
                price,
                land_area,
                constructed_meters,
                location,
                social_classification_area,
                features: JSON.parse(features),
                status,
                agreed_commission: JSON.parse(agreed_commission),
                fk_advisor,
                images: imagePaths
            });
            await newProperty.save();
            res.status(201).json({ message: "Propiedad creada exitosamente", property: newProperty });
        });
    } catch (error) {
        res.status(500).json({ message: "Error al crear la propiedad", error });
    }
};

module.exports = { addProperty };