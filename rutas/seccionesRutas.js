var ruta = require("express").Router();


ruta.get('/secciones', (req, res) => {
    res.render('secciones/acercaDelMedico');
});

ruta.get('/contactanos', (req, res) => {
    res.render('secciones/contactanos');
});



module.exports = ruta;
