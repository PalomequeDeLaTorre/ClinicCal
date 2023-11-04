var express=require("express");
var rutasPacientes=require("./rutas/pacientesRutas");
var rutasMedicos=require("./rutas/medicosRutas");
var rutasSecciones=require("./rutas/seccionesRutas");


var app=express();
app.use(express.static('logo'));
app.use(express.static('script'));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/",rutasPacientes);
app.use("/",rutasMedicos);
app.use("/",rutasSecciones);


var port=process.env.PORT || 3000;

app.listen(port,()=>{
    console.log("Servidor en http://localhost:"+port);
});


