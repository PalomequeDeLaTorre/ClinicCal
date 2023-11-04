var ruta=require("express").Router();
var {mostrarPacientes, nuevoPaciente, modificarPaciente, buscarPacientesPorID, borrarPaciente }=require("../bd/pacientesBD");

ruta.get('/', (req, res) => {
    res.render('secciones/inicio');
});

ruta.get('/perfil', (req, res) => {
    res.render('pacientes/perfil');
});

ruta.get("/pacientes",async(req,res)=>{
    var pacientes = await mostrarPacientes();
    console.log("Pacientes desde la base de datos:", pacientes); 
    res.render("pacientes/mostrar",{pacientes});
});

ruta.get('/login', (req, res) => {
    res.render('pacientes/login');
  });

  ruta.post('/login', async (req, res) => {
    var error = await mostrarPacientes(req.body);
    res.redirect("/pacientes");

  });

ruta.get("/nuevopaciente",async(req,res)=>{
    res.render("pacientes/nuevo");

});

ruta.post("/nuevopaciente",async(req, res)=>{
    var error=await nuevoPaciente(req.body);
    res.redirect("/login");

});

ruta.get("/editar/:id",async(req, res)=>{
    var pacient=await buscarPacientesPorID(req.params.id);
    console.log(pacient);
    res.render("pacientes/modificar",{pacient});

});

ruta.post("/editar", async(req,res)=>{
    var error=await modificarPaciente(req.body);
    res.redirect("/");
});

ruta.get("/borrar/:id", async(req,res)=>{
    await borrarPaciente(req.params.id);
    res.redirect("/");

});

module.exports=ruta;