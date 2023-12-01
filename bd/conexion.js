var admin=require("firebase-admin");
var keys=require("../keys.json");

admin.initializeApp({
    credential:admin.credential.cert(keys)
});

var micuenta=admin.firestore();
var conexionMedicos=micuenta.collection("MedicosBD"); 
var conexionPacientes=micuenta.collection("PacientesBD");
var conexionCitas=micuenta.collection("CitasBD"); 

module.exports={
    conexionMedicos,
    conexionPacientes,
    conexionCitas,
};
