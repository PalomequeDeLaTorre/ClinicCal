const horariosDisponibles = [
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00"
];

const fechaInput = flatpickr("#fecha_hora", {
    enableTime: true, 
    enableSeconds: false, 
    dateFormat: "Y-m-d H:i",
    minDate: "today", 
    maxDate: "2023-12-31 15:00", 
    inline: true, 
    defaultDate: "today", 
    disable: [
        function (date) {
       
            const hora = date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
            return !horariosDisponibles.includes(hora);
        }
    ]
});