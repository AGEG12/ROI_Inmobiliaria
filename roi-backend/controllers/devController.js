const User = require('../models/User');

const createAdminUser = async (req, res) => {
    try {
        const { name, surname, phone, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Administrador ya registrado' });
        }

        user = new User({ name, surname, phone, email, password, role });
        await user.save();

        res.status(201).json({ message: 'Administrador registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar administrador' });
    }
};

module.exports = { createAdminUser };