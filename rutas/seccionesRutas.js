var ruta = require("express").Router();


ruta.get('/secciones', (req, res) => {
    res.render('secciones/acercaDelMedico');
});


module.exports = ruta;