var express=require("express");
var rutasPacientes=require("./rutas/pacientesRutas");
var rutasMedicos=require("./rutas/medicosRutas");

var app=express();
app.use(express.static('logo'));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/",rutasPacientes);
app.use("/",rutasMedicos);

var port=process.env.PORT || 3000;

app.listen(port,()=>{
    console.log("Servidor en http://localhost:"+port);
});


