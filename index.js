var express=require("express");
var cors=require("cors");
var path=require("path");

var rutasPacientes=require("./rutas/pacientesRutas");
var rutasMedicos=require("./rutas/medicosRutas");
var rutasSecciones=require("./rutas/seccionesRutas");
var session = require('express-session');


var app=express();
app.use(express.static('logo'));
app.use(express.static('script'));
app.set("view engine", "ejs");
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(session({
    secret: 'secreto', 
    resave: false,
    saveUninitialized: true
}));

app.use("/", express.static(path.join(__dirname,"/web")));
app.use("/",rutasPacientes);
app.use("/",rutasMedicos);
app.use("/",rutasSecciones);


var port=process.env.PORT || 3000;

app.listen(port,()=>{
    console.log("Servidor en http://localhost:"+port);
});


