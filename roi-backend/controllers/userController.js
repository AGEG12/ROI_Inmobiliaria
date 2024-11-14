const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
            expiresIn: '1h',
        });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};

// Funcionalidad con problemas
const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById({ _id: userId });
        return res.json({ userId, currentPassword, newPassword, user });
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

        res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar la contraseña', error });
    }
}

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, surname, phone, email, currentPP } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                name,
                surname,
                phone,
                email,
                profile_picture: req.file ? req.file.filename : currentPP, 
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Datos del perfil actualizados' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar datos del perfil' });
    }
};


module.exports = { login, changePassword, updateProfile };