var ruta = require("express").Router();
var subirImage = require("../middlewares/subirImage");
var { mostrarMedicos, nuevoMedico, modificarMedico, buscarMedicosPorID, borrarMedico, verificarCredenciales } = require("../bd/medicosBD");
const fs = require('fs').promises;

ruta.get('/perfilMedico', async (req, res) => {
    if (req.session.isLoggedIn) {
      const medicoId = req.session.medicoId; 
      const nombre = req.session.medicoNombre;
      console.log(medicoId);
      if (medicoId) {
        const medico = await buscarMedicosPorID(medicoId);
        console.log(medico);
        res.render('medicos/perfilMedico', { medico });
      } else {
        res.redirect('/loginMedico'); 
      }
    } else {
      res.redirect('/loginMedico'); 
    }
  });

  
ruta.get('/loginMedico', (req, res) => {
    res.render('medicos/loginMedico');
  });

  ruta.post('/loginMedico', async (req, res) => {
    const { usuario, password } = req.body;
  
    const med = await verificarCredenciales(usuario, password);
    if (med) {
      req.session.isLoggedIn = true;
      req.session.medicoId = med.id;
      req.session.medicoNombre = med.nombre;
      res.redirect('/perfilMedico');
    } else {
      res.render('medicos/loginMedico', { error: 'Credenciales incorrectas' });
    }
  });

  /*ruta.get('/admin', async (req, res) => {
    if (req.session.isLoggedIn) {
      const medicoId = req.session.medicoId; 
      const nombre = req.session.medicoNombre;
      console.log(medicoId);
      if (medicoId) {
        const medico = await buscarMedicosPorID(medicoId);
        console.log(medico);
        res.render('medicos/admin', { medico });
      } else {
        res.redirect('/loginAdmin'); 
      }
    } else {
      res.redirect('/loginAdmin'); 
    }
  });*/


  ruta.get('/loginAdmin', (req, res) => {
    res.render('medicos/LoginAdmin');
  });

  ruta.post('/loginAdmin', async (req, res) => {
    const { usuario, password } = req.body;
  
    const med = await verificarCredenciales(usuario, password);
    if (med) {
      req.session.isLoggedIn = true;
      req.session.medicoId = med.id;
      req.session.medicoNombre = med.nombre;
      res.redirect('/admin');
    } else {
      res.render('medicos/loginAdmin', { error: 'Credenciales incorrectas' });
    }
  });


  ruta.get("/logoutMed", (req,res)=>{ 
    req.session=null;
    res.redirect("/loginMedico");
  
  });

ruta.get("/mostrarMedico", async (req, res) => {
    try {
      var medicos = await mostrarMedicos();
      res.render("medicos/mostrarMedico", { medicos }); 
    } catch (error) {
      console.error('Error al obtener medicos:', error);
      res.status(500).send("Error al obtener medicos");
    }
  });


ruta.get("/medicos",async(req,res)=>{
    var medicos = await mostrarMedicos(); 
    res.render("medicos/mostrarMedico",{medicos});
});

ruta.get("/nuevomedico", async (req, res) => {
    res.render("medicos/nuevo");
});

ruta.post("/nuevomedico", subirImage(),async(req, res)=>{
    req.body.foto=req.file.originalname;
    var error=await nuevoMedico(req.body);
    res.redirect("/loginMedico");
  
  });

ruta.get("/editarMedico/:id", async (req, res) => {
    var medico = await buscarMedicosPorID(req.params.id);
    res.render("medicos/modificar", { medico });
});

ruta.post("/editarMedico", subirImage(), async (req, res) => {
    try {
      const medicoAntesDeActualizar = await buscarMedicosPorID(req.body.id);
  
      if (req.file !== undefined) {
        req.body.foto = req.file.originalname;
  
        if (medicoAntesDeActualizar.foto) {
          await fs.unlink(`./web/images/${medicoAntesDeActualizar.foto}`);
        }
      } else {
       
        req.body.foto = req.body.fotoVieja;
      }
  
      var error = await modificarMedico(req.body);
  
      res.redirect("/perfilMedico");
    } catch (error) {
      console.error('Error al actualizar el medico:', error);
      res.status(500).send("Error al actualizar el medico");
    }
  });

  ruta.get("/borrarMedico/:id", async (req, res) => {
    try {
      const med = await buscarMedicosPorID(req.params.id);
      if (!med) {
        return res.status(404).send("Medico no encontrado");
      }
      await fs.unlink(`./web/images/${med.foto}`);
      await borrarMedico(req.params.id);
  
      res.redirect("/loginMedico");
    } catch (error) {
      console.error('Error al borrar la foto o medico:', error);
      res.status(500).send("Error al borrar la foto o medico");
    }
  });




module.exports = ruta;
