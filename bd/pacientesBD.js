var conexion=require("./conexion").conexionPacientes;
var {encriptarPassword}=require("../middlewares/passwordEncryption");
var Paciente=require("../modelos/Paciente");
const bcrypt = require('bcrypt');

async function verificarCredenciales(usuario, password) { 
    try {
        const querySnapshot = await conexion.where("usuario", "==", usuario).get();
        if (querySnapshot.empty) {
            return null;
        }
        const usuarioEncontrado = querySnapshot.docs[0].data();

        if (usuarioEncontrado.password !== undefined && usuarioEncontrado.salt !== undefined) {
            const contraseñaValida = compararPassword(password, usuarioEncontrado.password, usuarioEncontrado.salt);

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

async function compararPassword(contraseñaIngresada, contraseñaAlmacenada) {
    try {
        return await bcrypt.compare(contraseñaIngresada, contraseñaAlmacenada);
    } catch (error) {
        console.log("Error al comparar contraseñas: " + error);
        return false;
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

/*async function nuevoPaciente(datos){
    var pacient=new Paciente(null, datos);
    console.log(pacient);
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

}*/


/*async function modificarPaciente(datos){
    var pacient=new Paciente(datos.id,datos)
    var error=1;
    if (pacient.bandera === 0){
        try{
            await conexion.doc(pacient.id).set(pacient.obtenerDatos);
            console.log("Registro actualizado");
            error=0;

        }
        catch(err){
            console.log("Error al modificar al paciente"+err);

        }
    }
    return error;

}*/

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

/*async function modificarPaciente(datos){
    var error=1;
    var respuestaBuscar=await buscarPacientesPorID(datos.id);
    if(respuestaBuscar!=undefined){
        if(datos.password==""){ 
            datos.password=datos.passwordViejo; 
            datos.salt=datos.saltViejo; 
        }
        else{
            var {salt, hash}=encriptarPassword(datos.password); 
            datos.password=hash; 
            datos.salt=salt; 
        }
    var pacient=new Paciente(datos.id,datos)
    if (pacient.bandera === 0){
        try{
            await conexion.doc(pacient.id).set(pacient.obtenerDatos);
            console.log("Paciente actualizado");
            error=0;

        }
        catch(err){
            console.log("Error al modificar el paciente"+err);

        }
    }

}
    return error;

}*/

async function modificarPaciente(datos) {
    var error = 1;
    var respuestaBuscar = await buscarPacientesPorID(datos.id);

    if (respuestaBuscar !== undefined) {
        try {
            // Verificar si se proporcionó una nueva contraseña
            if (datos.password !== "") {
                var { salt, hash } = encriptarPassword(datos.password);
                datos.password = hash;
                datos.salt = salt;
            } else {
                // Si no se proporciona una nueva contraseña, mantener la antigua
                datos.password = respuestaBuscar.password;
                datos.salt = respuestaBuscar.salt;
            }

            // Verificar si se proporcionó una nueva foto
            if (datos.foto && datos.foto !== respuestaBuscar.foto) {
                // Si se proporciona una nueva foto y es diferente a la anterior, actualizarla
                // Eliminar la foto anterior si existe
                if (respuestaBuscar.foto) {
                    await fs.unlink(`./web/images/${respuestaBuscar.foto}`);
                }
            } else {
                // Si no se proporciona una nueva foto o es igual a la anterior, mantener la antigua
                datos.foto = respuestaBuscar.foto;
            }

            var pacient = new Paciente(datos.id, datos);

            if (pacient.bandera === 0) {
                await conexion.doc(pacient.id).set(pacient.obtenerDatos);
                console.log("Usuario actualizado");
                error = 0;
            }
        } catch (err) {
            console.log("Error al modificar el usuario" + err);
        }
    }

    return error;
}



/*async function borrarPaciente(id){
    try{
        await conexion.doc(id).delete();
        console.log("Registro borrado");

    }

    catch(err){
        console.log("Error al borrar el paciente" + err);

    }

}*/

/*async function borrarPaciente(id){
    var error=1;
    var pacient=await buscarPacientesPorID(id);
    if(pacient!=undefined){
    try{
        await conexion.doc(id).delete();
        console.log("Paciente borrado");
        error=0;
    }

    catch(err){
        console.log("Error al borrar el paciente" + err);

    }

    }

    return error;

}*/

async function borrarPaciente(id) {
    var error = 1;
    var pacient = await buscarPacientesPorID(id);

    if (pacient !== undefined) {
        try {
            // Eliminar la foto asociada al usuario
            if (pacient.foto) {
                await fs.unlink(`./web/images/${pacient.foto}`);
            }

            // Eliminar al usuario
            await conexion.doc(id).delete();
            console.log("Usuario borrado");
            error = 0;
        } catch (err) {
            console.log("Error al borrar el usuario" + err);
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
    compararPassword,
    
}