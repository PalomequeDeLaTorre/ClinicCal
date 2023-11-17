var conexion=require("./conexion").conexionMedicos;
var Medico=require("../modelos/Medico");

async function mostrarMedicos(){
    var meds=[];
    try{
       
        var medicos=await conexion.get();
        medicos.forEach(medico => {
            var med=new Medico(medico.id, medico.data());
            if (med.bandera === 0){
                meds.push(med.obtenerDatosM());
              
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
            med=medicoObjeto.obtenerDatosM();
            console.log(med);
        }

    }

    catch(err){
        console.log("Error al recuperar al medico" + err);
        
    }

    return med;

}

async function nuevoMedico(datos){
    var med=new Medico(null, datos);
    var error=1;
    if (med.bandera === 0){
    try{
        console.log(med.obtenerDatosM());
        await conexion.doc().set(med.obtenerDatosM());
        console.log("Medico insertado a la BD");
        error=0;
    }

    catch(err){
        console.log("Error al capturar el nuevo medico"+err);

    }

  }
  return error;

}

async function modificarMedico(datos){
    var med=new Medico(datos.id,datos)
    var error=1;
    if (med.bandera === 0){
        try{
            await conexion.doc(med.id).set(med.obtenerDatosM());
            console.log("Medico actualizado");
            error=0;

        }
        catch(err){
            console.log("Error al modificar al medico"+err);

        }
    }
    return error;

}

async function borrarMedico(id){
    try{
        await conexion.doc(id).delete();
        console.log("Medico borrado");

    }

    catch(err){
        console.log("Error al borrar al medico" + err);

    }

}

module.exports={
    mostrarMedicos,
    buscarMedicosPorID,
    nuevoMedico,
    modificarMedico,
    borrarMedico,
};