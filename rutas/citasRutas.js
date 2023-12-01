var ruta = require("express").Router();
var { mostrarCita, nuevaCita, modificarCita, buscarCitaPorID, borrarCita} = require("../bd/citasBD");
const fs = require('fs').promises;

ruta.get("/mostrarC", async (req, res) => {
  try {
    var citas = await mostrarCita();
    res.render("citas/mostrarC", { citas });
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).send("Error al obtener citas");
  }
});

ruta.get("/citas", async (req, res) => {
  var citas = await mostrarCita();
  res.render("citas/mostrarC", { citas });
});

ruta.get("/nuevacita", async (req, res) => {
  res.render("citas/nueva");
});

ruta.post("/nuevacita", async (req, res) => {
  var error = await nuevaCita(req.body);
  res.redirect("/perfil");
});

ruta.get("/editarCita/:id", async (req, res) => {
  var cit = await buscarCitaPorID(req.params.id);
  res.render("citas/modificarC", { cit });
});

ruta.post("/editarCita", async (req, res) => {
  try {
    var error = await modificarCita(req.body);
    res.redirect("/perfilMedico");
  } catch (error) {
    console.error('Error al actualizar la cita:', error);
    res.status(500).send("Error al actualizar la cita");
  }
});

ruta.get("/borrarCita/:id", async (req, res) => {
  try {
    await borrarCita(req.params.id);
    res.redirect("/perfilMedico");
  } catch (error) {
    console.error('Error al borrar la cita:', error);
    res.status(500).send("Error al borrar la cita");
  }
});

module.exports = ruta;
