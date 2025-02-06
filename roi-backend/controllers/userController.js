const User = require('../models/User');
const Property = require('../models/Property');
const Transaction = require('../models/Transaction');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Email o contraseña incorrectas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email o contraseña incorrectas' });
        }

        // JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};

const getUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el usuario", error });
    }
}

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el usuario", error });
    }
}

// Funcionalidad con problemas
const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña actual incorrecta' });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        return res.json({ message: 'Contraseña actualizada exitosamente', userId, currentPassword, newPassword, user });
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar la contraseña', error });
    }
}

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        const { name, surname, phone, email } = req.body;
        console.log("req.body");
        console.log(req.body);
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
                profile_picture
            },
            { new: true }
        );
        res.json({ message: 'Datos del perfil actualizados' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar datos del perfil', error });
    }
};

const deleteProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        if (!user.profile_picture) {
            return res.status(404).json({ message: "No se ha encontrado una foto de perfil que eliminar" });
        }
        const imagePath = path.join(__dirname, '..', 'uploads', 'profile_pictures', user.profile_picture);
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Error al eliminar la imagen de perfil:", err);
            }
        });
        user.profile_picture = null;
        user.save();
        res.json({ message: 'Foto de perfil eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar foto de perfil', error });
    }
}

const dashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const properties = await Property.aggregate([
            { $match: { fk_advisor: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalProperties: { $sum: 1 },
                    availableProperties: { $sum: { $cond: [{ $eq: ["$status", "Disponible"] }, 1, 0] } },
                    unavailableProperties: { $sum: { $cond: [{ $eq: ["$status", "No Disponible"] }, 1, 0] } },
                },
            },
        ]);
        const propertyStats = properties[0] || {
            totalProperties: 0,
            availableProperties: 0,
            unavailableProperties: 0,
        };

        const transactions = await Transaction.aggregate([
            { $match: { "fk_advisor": new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalTransactions: { $sum: 1 },
                    totalAmount: { $sum: "$amount" },
                    totalCommissions: { $sum: "$commission" },
                },
            },
        ]);
        const transactionStats = transactions[0] || {
            totalTransactions: 0,
            totalAmount: 0,
            totalCommissions: 0,
        };

        const response = {
            user,
            propertyStats,
            transactionStats,
        };
        return res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el stats", error });
    }
}


module.exports = { login, getUser, getUserById, changePassword, updateProfile, deleteProfilePicture, dashboard };