var conexion=require("./conexion").conexionPacientes;
var {encriptarPassword, validarPassword}=require("../middlewares/passwordEncryption");
var Paciente=require("../modelos/Paciente");
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');


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
    try {
        const respuestaBuscar = await buscarPacientesPorID(datos.id);

        if (respuestaBuscar !== undefined) {
            if (datos.password !== "") {
                const { salt, hash } = encriptarPassword(datos.password);
                datos.password = hash;
                datos.salt = salt;
            } else {
                datos.password = respuestaBuscar.password;
                datos.salt = respuestaBuscar.salt;
            }

            if (datos.foto && datos.foto !== respuestaBuscar.foto) {
                if (respuestaBuscar.foto) {
                    const filePath = path.normalize(`./web/images/${respuestaBuscar.foto}`);

                    try {
                        await fs.unlink(filePath);
                        console.log(`Archivo ${respuestaBuscar.foto} eliminado`);
                    } catch (unlinkError) {
                        console.log(`Error al intentar eliminar ${respuestaBuscar.foto}: ${unlinkError}`);
                    }
                }
            } else {
                datos.foto = respuestaBuscar.foto;
            }

            const pacient = new Paciente(datos.id, datos);

            if (pacient.bandera === 0) {
                await conexion.doc(pacient.id).set(pacient.obtenerDatos);
                console.log("Paciente actualizado");
                return 0; 
            } else {
                console.log("Error al modificar el paciente: Datos inválidos");
                return 1; 
            }
        } else {
            console.log("No se encontró el paciente a modificar");
            return 1; 
        }
    } catch (err) {
        console.log("Error al modificar el paciente: " + err);
        return 1; 
    }
}

async function borrarPaciente(id) {
    try {
        const pacient = await buscarPacientesPorID(id);

        if (pacient !== undefined) {
            if (pacient.foto) {
                const filePath = path.normalize(`./web/images/${pacient.foto}`);

                try {
                    await fs.unlink(filePath);
                    console.log(`Archivo ${pacient.foto} eliminado`);
                } catch (unlinkError) {
                    console.log(`Error al intentar eliminar ${pacient.foto}: ${unlinkError}`);
                }
            }

            await conexion.doc(id).delete();
            console.log("Paciente borrado");

            return 0;
        } else {
            console.log("No se encontró el paciente a borrar");
            return 1; 
        }
    } catch (err) {
        console.log("Error al borrar el paciente: " + err);
        return 1; 
    }
}



module.exports={
    mostrarPacientes,
    buscarPacientesPorID,
    nuevoPaciente,
    modificarPaciente,
    borrarPaciente,
    verificarCredenciales,
    
};