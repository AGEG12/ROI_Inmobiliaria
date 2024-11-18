const User = require('../models/User');
const Property = require('../models/Property');
const Transaction = require('../models/Transaction');
const path = require('path');
const fs = require('fs');

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios", error });
    }
}

const getProperties = async (req, res) => {
    try {
        const properties = await Property.find();
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener propiedades", error });
    }
}

const getTransactions = async (req, res) => {
    try {
        const transaction = await Transaction.find();
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener transacciones", error });
    }
}

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
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        const { name, surname, phone, email, role } = req.body;
        let profile_picture;
        if (req.file) {
            profile_picture = req.file.filename;
            if (user.profile_picture) {
                const imagePath = path.join(__dirname, '..', 'uploads', 'profile_pictures', user.profile_picture);
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error("Error al eliminar la imagen de perfil:", err);
                    }
                });
            }
        } else {
            profile_picture = user.profile_picture;
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                name,
                surname,
                phone,
                email,
                profile_picture,
                role
            },
            { new: true }
        );
        res.json({ message: 'Datos del usuario actualizados' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el Usuario' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const adminId = req.user.id;

        const user = await User.findById(userId);

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
        await Property.updateMany({ fk_advisor: userId }, { fk_advisor: adminId });
        await Transaction.updateMany({ fk_advisor: userId }, { fk_advisor: adminId });

        await User.findByIdAndDelete(userId);

        res.json({ message: 'Usuario eliminado, y propiedades y transacciones reasignadas' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
};

module.exports = { getUsers, getProperties, getTransactions, createUser, updateUser, deleteUser };