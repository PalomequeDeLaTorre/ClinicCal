var ruta=require("express").Router();
var subirImage = require("../middlewares/subirImage");
var {mostrarPacientes, nuevoPaciente, modificarPaciente, buscarPacientesPorID, borrarPaciente,verificarCredenciales }=require("../bd/pacientesBD");
const fs = require('fs').promises;

ruta.get('/', (req, res) => {
    res.render('secciones/inicio');
});

ruta.get('/perfil', async (req, res) => {
  if (req.session.isLoggedIn) {
    const pacienteId = req.session.pacienteId; 

    if (pacienteId) {
      const paciente = await buscarPacientesPorID(pacienteId);
      res.render('pacientes/perfil', { paciente });
    } else {
      res.redirect('/login'); 
    }
  } else {
    res.redirect('/login'); 
  }
});

ruta.get('/login', (req, res) => {
    res.render('pacientes/login');
  });

  ruta.post('/login', async (req, res) => {
    const { usuario, password } = req.body;
  
    const pacient = await verificarCredenciales(usuario, password);
  
    if (pacient) {
      req.session.isLoggedIn = true;
      req.session.pacienteId = pacient.id;
      req.session.pacienteNombre = pacient.nombre;
      res.redirect('/mostrar');
    } else {
      res.render('pacientes/login', { error: 'Credenciales incorrectas' });
    }
  });

  
  ruta.get("/mostrar", async (req, res) => {
    try {
      var pacientes = await mostrarPacientes();
      res.render("pacientes/mostrar", { pacientes }); 
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      res.status(500).send("Error al obtener pacientes");
    }
  });
  

ruta.post('/login', async (req, res) => {
    var error = await mostrarPacientes(req.body);
    res.redirect("/pacientes");

  });

  ruta.get("/pacientes",async(req,res)=>{
    var pacientes = await mostrarPacientes(); 
    res.render("pacientes/mostrar",{pacientes});
});



ruta.get("/nuevopaciente",async(req,res)=>{
    res.render("pacientes/nuevo");

});

ruta.post("/nuevopaciente", subirImage(),async(req, res)=>{
  req.body.foto=req.file.originalname;
  var error=await nuevoPaciente(req.body);
  res.redirect("/login");

});

ruta.get("/editarPaciente/:id",async(req, res)=>{
  var pacient=await buscarPacientesPorID(req.params.id);
  res.render("pacientes/modificar",{pacient});

});

ruta.post("/editarPaciente", subirImage(), async (req, res) => {
  try {
    const pacienteAntesDeActualizar = await buscarPacientesPorID(req.body.id);

    if (req.file !== undefined) {
      req.body.foto = req.file.originalname;

      if (pacienteAntesDeActualizar.foto) {
        await fs.unlink(`./web/images/${pacienteAntesDeActualizar.foto}`);
      }
    } else {
     
      req.body.foto = req.body.fotoVieja;
    }

    var error = await modificarPaciente(req.body);

    res.redirect("/");
  } catch (error) {
    console.error('Error al actualizar el paciente:', error);
    res.status(500).send("Error al actualizar el paciente");
  }
});

ruta.get("/borrarPaciente/:id", async (req, res) => {
  try {
    const pacient = await buscarPacientesPorID(req.params.id);
    if (!pacient) {
      return res.status(404).send("Paciente no encontrado");
    }
    await fs.unlink(`./web/images/${pacient.foto}`);
    await borrarPaciente(req.params.id);

    res.redirect("/");
  } catch (error) {
    console.error('Error al borrar la foto o paciente:', error);
    res.status(500).send("Error al borrar la foto o paciente");
  }
});

module.exports=ruta;