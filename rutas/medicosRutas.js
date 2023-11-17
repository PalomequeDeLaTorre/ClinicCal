var ruta = require("express").Router();
var { mostrarMedicos, nuevoMedico, modificarMedico, buscarMedicosPorID, borrarMedico } = require("../bd/medicosBD");

ruta.get('/medicos', (req, res) => {
    res.render('medicos/loginMedico');
  });

ruta.post('/loginMedico', async (req, res) => {
    var error = await mostrarMedicos(req.body);
    res.redirect("/mostrarMedico");

  });
  
ruta.get("/mostrarMedico", async (req, res) => {
    var medicos = await mostrarMedicos();
    res.render("medicos/mostrarMedico", { medicos });
});

ruta.get("/nuevomedico", async (req, res) => {
    res.render("medicos/nuevo");
});

ruta.post("/nuevomedico", async (req, res) => {
    var error = await nuevoMedico(req.body);
    res.redirect("/medicos");
});

ruta.get("/editarMedico/:id", async (req, res) => {
    var medico = await buscarMedicosPorID(req.params.id);
    res.render("medicos/modificar", { medico });
});

ruta.post("/editarMedico", async (req, res) => {
    var error = await modificarMedico(req.body);
    res.redirect("/medicos");
});

ruta.get("/borrarMedico/:id", async (req, res) => {
    await borrarMedico(req.params.id);
    res.redirect("/medicos");
});

module.exports = ruta;
