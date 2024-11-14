const Property = require('../models/Property');
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
            const { type_property, deal, title, description, price, payment_periodicity, land_area, constructed_meters, location, social_classification_area, number_bedrooms, number_bathrooms, cistern_capacity, garage_description, additional_notes, status, percentage, amount, notes } = req.body;
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
                location,
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
        res.json({ property });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la propiedad", error });
    }
}

// Postman no envía nada al req.body si usamos from-data
const updateProperty = async (req, res) => {
    try {
        const propertyId = req.params.id;
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: "Propiedad no encontrada" });
        }
        if (property.fk_advisor.toString() !== req.user.id) {
            return res.status(403).json({ message: "No tienes permiso para editar esta propiedad" });
        }

        const { type_property, deal, title, description, price, payment_periodicity, land_area, constructed_meters, location, social_classification_area, number_bedrooms, number_bathrooms, cistern_capacity, garage_description, additional_notes, status, percentage, amount, notes } = req.body;
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
                location,
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
        if (property.fk_advisor.toString() !== req.user.id) {
            return res.status(403).json({ message: "No tienes permiso para editar esta propiedad" });
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

// Falta eliminar imagenes que superan el límite de 12
const addImages = async (req, res) => {
    try {
        const propertyId = req.params.id;
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: "Propiedad no encontrada" });
        }
        if (property.fk_advisor.toString() !== req.user.id) {
            return res.status(403).json({ message: "No tienes permiso para editar esta propiedad" });
        }
        await uploadPI(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: "Error al cargar las imágenes", error: err });
            }
            const imagesFilename = req.files.map(file => file.filename);

            if (property.images.length >= 12) {
                return res.status(400).json({ message: "Se ha alcanzado el límite de 12 imágenes por propiedad" });
            }
            const remainingSlots = 12 - property.images.length;
            /* let notAddedImages = imagesFilename.slice(-(imagesFilename.length - remainingSlots)) */
            imagesFilename.splice(remainingSlots,imagesFilename.length - remainingSlots);
            /* notAddedImages.forEach(imageName => {
                const imagePath = path.join(__dirname, '..', 'uploads', 'property_images', imageName);
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error("Error al eliminar la imagen:", err);
                    }
                });
            }); */
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
        if (property.fk_advisor.toString() !== req.user.id) {
            return res.status(403).json({ message: "No tienes permiso para editar esta propiedad" });
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

const dashboard = async (req, res) => {
    
}

module.exports = { addProperty, getProperty, updateProperty, deleteProperty, addImages, deleteImage };