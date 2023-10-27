var admin=require("firebase-admin");
var keys=require("../keys.json");

admin.initializeApp({
    credential:admin.credential.cert(keys)
});

var micuenta=admin.firestore();
var conexionMedicos=micuenta.collection("MedicosBD"); 
var conexionPacientes=micuenta.collection("PacientesBD"); 

module.exports={
    conexionMedicos,
    conexionPacientes
};
