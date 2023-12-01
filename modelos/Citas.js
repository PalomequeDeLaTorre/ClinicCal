class Citas {
    constructor(id, data) {
        this.bandera = 0;
        this._id = id;

        if (data && typeof data === 'object') {
            this.nombre = data.nombre || '';
            this.apellidos = data.apellidos || '';
            this.edad = data.edad || '';
            this.fecha = data.fecha || '';
            this.hora = data.hora || '';
        } else {
            this.bandera = 1;
        }
        
        console.log('Valores en el constructor:', this._id, this.nombre, this.apellidos);
    }


    
    
    set id(id){
        if(id!=null)
            id.length > 0 ? (this._id=id) : (this.bandera=1);
    }

    set nombre(nombre) {
    this._nombre = (nombre && nombre.length > 0) ? nombre : '';
   }

   set apellidos(apellidos) {
    this._apellidos = (apellidos && apellidos.length > 0) ? apellidos : '';
   }

   set edad(edad) {
    this._edad = (edad && edad.length > 0) ? edad : '';
   }

   set fecha(fecha) {
    this._fecha = (fecha && fecha.length > 0) ? fecha : '';
   }

   set hora(hora) {
    this._hora = (hora && hora.length > 0) ? hora : '';
   }

   
    


    get id(){
        return this._id;
    }

    get nombre(){
        return this._nombre;
    }

    get apellidos(){
        return this._apellidos;
    }

    get edad(){
        return this._edad;
    }

    get fecha(){
        return this._fecha;
    }

    get hora(){
        return this._hora;
    }



    get obtenerDatosC() {
        if (this.id != null) {
            return {
                id: this.id,
                nombre: this.nombre,
                apellidos: this.apellidos,
                edad: this.edad,
                fecha: this.fecha,
                hora: this.hora,
            };
        } else {
            return {
                nombre: this.nombre,
                apellidos: this.apellidos,
                edad: this.edad,
                fecha: this.fecha,
                hora: this.hora,
            };
        }
    }
}    

module.exports=Citas;