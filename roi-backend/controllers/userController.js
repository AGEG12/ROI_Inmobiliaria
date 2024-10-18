const getUser = (req, res) => {
    console.log('Desde el controlador user');
    res.json({
        status: 'success',
        data: {
            test: 'Enviando la data...'
        }
    });
}

const saveUser = (req, res) => {
    console.log('Desde el controlador user');
    res.json({
        status: 'success',
        data: {
            test: 'Guardando la data...'
        }
    });
}


module.exports = { getUser, saveUser }