var conexion=require("./conexion").conexionMedicos;
var {encriptarPassword, validarPassword}=require("../middlewares/passwordEncryption");
var Medico=require("../modelos/Medico");
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


async function mostrarMedicos(){
    var meds=[];
    try{
       
        var medicos=await conexion.get();
        medicos.forEach(medico => {
            var med=new Medico(medico.id, medico.data());
            if (med.bandera === 0){
                meds.push(med.obtenerDatosM);
              
            }
            
        });  

    }

    catch(err){
        console.log("Error al recuperar medicos de la base de datos"+err);

    }

    return meds;
 
}

async function buscarMedicosPorID(id){
    var med;

    try {
        var medico=await conexion.doc(id).get();
        var medicoObjeto=new Medico(medico.id, medico.data());
        if (medicoObjeto.bandera === 0){
            med=medicoObjeto.obtenerDatosM;
            console.log(med);
        }

    }

    catch(err){
        console.log("Error al recuperar el medico" + err);
        
    }

    return med;

}

async function nuevoMedico(datos){
    var {hash, salt}=encriptarPassword(datos.password); 
    datos.password=hash; 
    datos.salt=salt; 
    var med=new Medico(null,datos);
    var error=1;
    if (med.bandera === 0){
    try{
        await conexion.doc().set(med.obtenerDatosM);
        console.log("Medico insertado a la BD");
        error=0;
    }

    catch(err){
        console.log("Error al capturar el nuevo medico"+err);

    }

  }
  return error;

}



async function modificarMedico(datos) {
    try {
        const respuestaBuscar = await buscarMedicosPorID(datos.id);

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

            const med = new Medico(datos.id, datos);
            
            if (med.bandera === 0) {
                await conexion.doc(med.id).set(med.obtenerDatosM);
                console.log("Medico actualizado");
                return 0; 
            } else {
                console.log("Error al modificar el médico: Datos inválidos");
                return 1; 
            }
        } else {
            console.log("No se encontró el médico a modificar");
            return 1; 
        }
    } catch (err) {
        console.log("Error al modificar el médico: " + err);
        return 1; 
    }
}



async function borrarMedico(id) {
    try {
        const med = await buscarMedicosPorID(id);

        if (med !== undefined) {
            if (med.foto) {
                const filePath = path.normalize(`./web/images/${med.foto}`);
                
                try {
                    await fs.unlink(filePath);
                    console.log(`Archivo ${med.foto} eliminado`);
                } catch (unlinkError) {
                    console.log(`Error al intentar eliminar ${med.foto}: ${unlinkError}`);
                }
            }

            await conexion.doc(id).delete();
            console.log("Medico borrado");
            
            return 0; 
        } else {
            console.log("No se encontró el médico a borrar");
            return 1; 
        }
    } catch (err) {
        console.log("Error al borrar el médico: " + err);
        return 1; 
    }
}




  
module.exports={
    mostrarMedicos,
    buscarMedicosPorID,
    nuevoMedico,
    modificarMedico,
    borrarMedico,
    verificarCredenciales,
   
};