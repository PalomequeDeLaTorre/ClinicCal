var dia1 = 'Día de los santos inocentes';

						  
function limpiar()
{
  document.getElementById('cuadroTexto').value ='';
}
function computadora(day=dia1,form='cuadroTexto')
{
  document.getElementById(form).value = agenda[day];
}