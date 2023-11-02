document.getElementById('registrationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const mensaje = document.getElementById('mensaje').value;
    
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, correo, mensaje }) });
  
    const data = await response.json();
    alert(data.message);
  });

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registration-form');

    form.addEventListener('submit', function (event) {
      event.preventDefault(); 

      
      window.location.href = 'https://graciasporregistrarte.onrender.com';

    });
  });
  