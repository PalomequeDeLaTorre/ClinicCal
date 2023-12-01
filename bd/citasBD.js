var conexion = require("./conexion").conexionCitas;
var Citas = require("../modelos/Citas");
const bcrypt = require('bcrypt');

async function mostrarCita() {
    var cits = [];
    try {
        var citas = await conexion.get();
        citas.forEach(cita => {
            var cit = new Citas(cita.id, cita.data());
            if (cit.bandera === 0) {
                cits.push(cit.obtenerDatosC);
            }
        });
        
    } catch (err) {
        console.log("Error al recuperar citas de la base de datos" + err);
    }

    return cits;
}

async function buscarCitaPorID(id) {
    var cit;

    try {
        var cita = await conexion.doc(id).get();
        var citaObjeto = new Citas(cita.id, cita.data());
        if (citaObjeto.bandera === 0) {
            cit = citaObjeto.obtenerDatosC;
        }
    } catch (err) {
        console.log("Error al recuperar la cita" + err);
    }

    return cit;
}

async function nuevaCita(datos) {
    console.log('Datos antes de crear una nueva instancia de Citas:', datos);
    var cit = new Citas(null, datos);
    console.log('Datos después de crear una nueva instancia de Citas:', cit);
    var cit = new Citas(null, datos);
    var error = 1;

    try {
        if (cit.bandera === 0) {
            console.log("Datos a insertar:", cit.obtenerDatosC);
            await conexion.doc().set(cit.obtenerDatosC);
            console.log("Cita insertada a la BD");
            error = 0;
        } else {
            console.log("No se insertó la cita. Campos inválidos.");
        }
    } catch (err) {
        console.log("Error al capturar la cita", err);
    }

    return error;
}


async function modificarCita(datos) {
    var error = 1;
    var respuestaBuscar = await buscarCitaPorID(datos.id);

    if (respuestaBuscar !== undefined) {
        try {
            if (datos.password !== "") {
                var { hash } = encriptarPassword(datos.password);
                datos.password = hash;
            } else {
                datos.password = respuestaBuscar.password;
            }

            var cit = new Citas(datos.id, datos);

            if (cit.bandera === 0) {
                await conexion.doc(cit.id).set(cit.obtenerDatosC);
                console.log("Cita actualizada");
                error = 0;
            }
        } catch (err) {
            console.log("Error al modificar el paciente" + err);
        }
    }

    return error;
}

async function borrarCita(id) {
    var error = 1;
    var cit = await buscarCitaPorID(id);

    if (cit !== undefined) {
        try {
            await conexion.doc(id).delete();
            console.log("Cita borrada");
            error = 0;
        } catch (err) {
            console.log("Error al borrar la cita" + err);
        }
    }

    return error;
}

module.exports = {
    mostrarCita,
    buscarCitaPorID,
    nuevaCita,
    modificarCita,
    borrarCita,
};
