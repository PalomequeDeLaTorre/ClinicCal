var conexion=require("./conexion").conexionPacientes;
var Paciente=require("../modelos/Paciente");

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

}

async function modificarPaciente(datos){
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

}

async function borrarPaciente(id){
    try{
        await conexion.doc(id).delete();
        console.log("Registro borrado");

    }

    catch(err){
        console.log("Error al borrar el paciente" + err);

    }

}

module.exports={
    mostrarPacientes,
    buscarPacientesPorID,
    nuevoPaciente,
    modificarPaciente,
    borrarPaciente
}