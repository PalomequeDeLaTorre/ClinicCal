var conexion=require("./conexion").conexionPacientes;
var {encriptarPassword, validarPassword}=require("../middlewares/passwordEncryption");
var Paciente=require("../modelos/Paciente");
const bcrypt = require('bcrypt');

async function verificarCredenciales(usuario, password) { 
    try {
        const querySnapshot = await conexion.where("usuario", "==", usuario).get();
        if (querySnapshot.empty) {
            return null;
        }
        var usuarioEncontrado = querySnapshot.docs[0].data();
        usuarioEncontrado.id=  querySnapshot.docs[0].id;
        if (usuarioEncontrado.password !== undefined && usuarioEncontrado.salt !== undefined) {
          
            const contraseñaValida = await validarPassword(password, usuarioEncontrado.password, usuarioEncontrado.salt);
            if (contraseñaValida) {
                return usuarioEncontrado;
            } else {
                return null;
            }
        } else {
            return null; 
        }
    } catch (error) {
        console.log("Error al verificar las credenciales: " + error);
        return null;
    }
}


async function mostrarPacientes(){
    var pacients=[];
    try{

        var pacientes=await conexion.get();
        pacientes.forEach(paciente => {
            var pacient=new Paciente(paciente.id, paciente.data());
            if (pacient.bandera === 0){
                pacients.push(pacient.obtenerDatos);
    
            }
            
        });  

    }

    catch(err){
        console.log("Error al recuperar pacientes de la base de datos"+err);

    }

    return pacients;
 
}

async function buscarPacientesPorID(id){
    var pacient;

    try {
        var paciente=await conexion.doc(id).get();
        var pacienteObjeto=new Paciente(paciente.id, paciente.data());
        if (pacienteObjeto.bandera === 0){
            pacient=pacienteObjeto.obtenerDatos;
        }

    }

    catch(err){
        console.log("Error al recuperar al paciente" + err);
        
    }

    return pacient;

}

async function nuevoPaciente(datos){
    var {hash, salt}=encriptarPassword(datos.password); 
    datos.password=hash; 
    datos.salt=salt; 
    var pacient=new Paciente(null,datos);
    var error=1;
    if (pacient.bandera === 0){
    try{
        await conexion.doc().set(pacient.obtenerDatos);
        console.log("Paciente insertado a la BD");
        error=0;
    }

    catch(err){
        console.log("Error al capturar al nuevo paciente"+err);

    }

  }
  return error;

}

async function modificarPaciente(datos) {
    var error = 1;
    var respuestaBuscar = await buscarPacientesPorID(datos.id);

    if (respuestaBuscar !== undefined) {
        try {
            
            if (datos.password !== "") {
                var { salt, hash } = encriptarPassword(datos.password);
                datos.password = hash;
                datos.salt = salt;
            } else {
              
                datos.password = respuestaBuscar.password;
                datos.salt = respuestaBuscar.salt;
            }

            if (datos.foto && datos.foto !== respuestaBuscar.foto) {
                
                if (respuestaBuscar.foto) {
                    await fs.unlink(`./web/images/${respuestaBuscar.foto}`);
                }
            } else {
            
                datos.foto = respuestaBuscar.foto;
            }

            var pacient = new Paciente(datos.id, datos);

            if (pacient.bandera === 0) {
                await conexion.doc(pacient.id).set(pacient.obtenerDatos);
                console.log("Paciente actualizado");
                error = 0;
            }
        } catch (err) {
            console.log("Error al modificar el paciente" + err);
        }
    }

    return error;
}


async function borrarPaciente(id) {
    var error = 1;
    var pacient = await buscarPacientesPorID(id);

    if (pacient !== undefined) {
        try {
            
            if (pacient.foto) {
                await fs.unlink(`./web/images/${pacient.foto}`);
            }

         
            await conexion.doc(id).delete();
            console.log("Usuario borrado");
            error = 0;
        } catch (err) {
            console.log("Error al borrar el paciente" + err);
        }
    }

    return error;
}


module.exports={
    mostrarPacientes,
    buscarPacientesPorID,
    nuevoPaciente,
    modificarPaciente,
    borrarPaciente,
    verificarCredenciales,
    
};