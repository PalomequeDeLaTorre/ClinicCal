var ruta = require("express").Router();


ruta.get('/secciones', (req, res) => {
    res.render('secciones/acercaDelMedico');
});

ruta.get('/sobreNosotros', (req, res) => {
    res.render('secciones/sobreNosotros');
});

ruta.get('/contactanos', (req, res) => {
    res.render('secciones/contactanos');
});

ruta.get('/politicasDePrivacidad', (req, res) => {
    res.render('secciones/politicasDePrivacidad');
});


module.exports = ruta;
