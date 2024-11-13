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
const getUser = (req, res) => {
        const email = req.body;

        let user = User.findOne({ email });
        console.log(user);
        if (user) {
            return res.json({
                status: 'success',
                data: {
                    test: 'Usuario encontrado'
                }
            });
        }
};

module.exports = { createAdminUser, getUser };