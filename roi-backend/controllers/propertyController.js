const Property = require('../models/Property');
const Transaction = require('../models/Transaction');
const { uploadPI } = require('../middleware/multerMiddleware');
const path = require('path');
const fs = require('fs');

const addProperty = async (req, res) => {
    try {
        uploadPI(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: "Error al cargar las imágenes", error: err });
            }
            const fk_advisor = req.user.id;
            const { type_property, deal, title, description, price, payment_periodicity, land_area, constructed_meters, state, city, zip_code, settlement, references, social_classification_area, number_bedrooms, number_bathrooms, cistern_capacity, garage_description, additional_notes, status, percentage, amount, notes } = req.body;
            const imagesFilename = req.files.map(file => file.filename);
            const newProperty = new Property({
                type_property,
                deal,
                title,
                description,
                price,
                payment_periodicity,
                land_area,
                constructed_meters,
                location: {
                    state,
                    city,
                    zip_code,
                    settlement,
                    references
                },
                social_classification_area,
                features: {
                    number_bedrooms,
                    number_bathrooms,
                    cistern_capacity,
                    garage_description,
                    additional_notes
                },
                status,
                agreed_commission: {
                    percentage,
                    amount,
                    notes
                },
                fk_advisor,
                images: imagesFilename
            });
            await newProperty.save();
            res.status(201).json({ message: "Propiedad creada exitosamente", property: newProperty });
        });
    } catch (error) {
        res.status(500).json({ message: "Error al crear la propiedad", error });
    }
};

const getProperty = async (req, res) => {
    try {
        const propertyId = req.params.id;
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: "Propiedad no encontrada" });
        }
        const transaction = await Transaction.findOne( { fk_property: propertyId } );
        const transactionId = !transaction ?  null : transaction._id;

        res.json({ property, transactionId });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la propiedad", error });
    }
}

const updateProperty = async (req, res) => {
        try {
        const propertyId = req.params.id;
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: "Propiedad no encontrada" });
        }
        if (property.fk_advisor.toString() !== req.user.id || req.user.role !== "admin") {
            return res.status(403).json({ message: "No tienes permiso para editar esta propiedad" });
        }
        const transaction = await Transaction.findOne( { fk_property: propertyId } );
        if ( transaction ) {
            return res.status(403).json({ message: "No es posible editar una propiedad relacionada a una transacción" });
        }

        const { type_property, deal, title, description, price, payment_periodicity, land_area, constructed_meters, state, city, zip_code, settlement, references, social_classification_area, number_bedrooms, number_bathrooms, cistern_capacity, garage_description, additional_notes, status, percentage, amount, notes } = req.body;
        const updatedProperty = await Property.findByIdAndUpdate(
            propertyId,
            {
                type_property,
                deal,
                title,
                description,
                price,
                payment_periodicity,
                land_area,
                constructed_meters,
                location: {
                    state,
                    city,
                    zip_code,
                    settlement,
                    references
                },
                social_classification_area,
                features: {
                    number_bedrooms,
                    number_bathrooms,
                    cistern_capacity,
                    garage_description,
                    additional_notes
                },
                status,
                agreed_commission: {
                    percentage,
                    amount,
                    notes
                }
            },
            { new: true });

        res.status(200).json({ message: "Propiedad actualizada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la propiedad", error });
    }
};

const deleteProperty = async (req, res) => {
    try {
        const propertyId = req.params.id;
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: "Propiedad no encontrada" });
        }
        if (property.fk_advisor.toString() !== req.user.id || req.user.role !== "admin") {
            return res.status(403).json({ message: "No tienes permiso para eliminar esta propiedad" });
        }
        const transaction = await Transaction.findOne( { fk_property: propertyId } );
        if ( transaction ) {
            return res.status(403).json({ message: "No es posible eliminar una propiedad relacionada a una transacción" });
        }

        property.images.forEach(imageName => {
            const imagePath = path.join(__dirname, '..', 'uploads', 'property_images', imageName);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Error al eliminar la imagen:", err);
                }
            });
        });

        await Property.findByIdAndDelete(propertyId);

        res.status(200).json({ message: "Propiedad eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la propiedad", error });
    }
}

const addImages = async (req, res) => {
    try {
        const propertyId = req.params.id;
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: "Propiedad no encontrada" });
        }
        if (property.fk_advisor.toString() !== req.user.id || req.user.role !== "admin") {
            return res.status(403).json({ message: "No tienes permiso para agregar imágenes a esta propiedad" });
        }
        await uploadPI(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: "Error al cargar las imágenes", error: err });
            }
            const imagesFilename = req.files.map(file => file.filename);
            const remainingSlots = 12 - property.images.length;
            if ((remainingSlots - imagesFilename.length) < 0) {
                imagesFilename.forEach(imageName => {
                    const imagePath = path.join(__dirname, '..', 'uploads', 'property_images', imageName);
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            console.error("Error al eliminar la imagen:", err);
                        }
                    });
                });
                return res.status(400).json({ message: "No puedes agregar más de 12 imágenes a una propiedad, especios disponibles: " + remainingSlots });
            }
            property.images.push(...imagesFilename);
            await property.save();
            res.status(200).json({ message: imagesFilename.length + ': imágenes se agregaron exitosamente' });
        });
    } catch (error) {
        res.status(500).json({ message: "Error al agregar imágenes a la propiedad", error });
    }
}

const deleteImage = async (req, res) => {
    try {
        const { propertyId, imageName } = req.params;
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: "Propiedad no encontrada" });
        }
        if (property.fk_advisor.toString() !== req.user.id || req.user.role !== "admin") {
            return res.status(403).json({ message: "No tienes permiso para eliminar imágenes de esta propiedad" });
        }

        const imageIndex = property.images.indexOf(imageName);
        if (imageIndex === -1) {
            return res.status(404).json({ message: "Imagen no encontrada en la propiedad" });
        }

        property.images.splice(imageIndex, 1);
        await property.save();

        const imagePath = path.join(__dirname, '..', 'uploads', 'property_images', imageName);
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Error al eliminar la imagen:", err);
            }
        });
        res.status(200).json({ message: "Imagen eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la imagen de la propiedad", error });
    }
}

module.exports = { addProperty, getProperty, updateProperty, deleteProperty, addImages, deleteImage };