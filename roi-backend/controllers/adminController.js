const User = require('../models/User');
const Property = require('../models/Property');
const path = require('path');
const fs = require('fs');

const createUser = async (req, res) => {
    try {
        const fk_admin = req.user.id;
        const { name, surname, phone, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Usuario ya registrado' });
        }
        user = new User({
            name,
            surname,
            phone,
            email,
            password,
            role,
            fk_admin,
            profile_picture: req.file ? req.file.filename : null
        });
        await user.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, surname, phone, email, role, currentPP } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                name,
                surname,
                phone,
                email,
                profile_picture: req.file ? req.file.filename : currentPP,
                role
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Datos del usuario actualizados' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el Usuario' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;
        
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        if (user.profile_picture) {
            const imagePath = path.join(__dirname, '..', 'uploads', 'profile_pictures', user.profile_picture);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Error al eliminar la imagen de perfil:", err);
                } else {
                    console.log("Imagen de perfil eliminada exitosamente");
                }
            });
        }
        await Property.updateMany({ fk_advisor: id }, { fk_advisor: adminId });

        await User.findByIdAndDelete(id);

        res.json({ message: 'Usuario eliminado y propiedades reasignadas' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
};

const dashboard = (req, res) => {
    console.log('Desde el dashboard');
    res.json({
        status: 'success',
        data: {
            test: 'Este es el dashboard'
        }
    });
}

module.exports = { createUser, updateUser, deleteUser, dashboard };