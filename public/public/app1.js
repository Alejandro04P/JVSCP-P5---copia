const form = document.getElementById('myForm');
const submitButton = document.getElementById('submitButton');
// Cargar datos guardados en sessionStorage al cargar la página
form.addEventListener('submit', function(event) {
    const formData = new FormData(form);  // Captura los datos del formulario
    const formObj = {};
    event.preventDefault();  // Prevenir la acción por defecto del formulario
   
    formData.forEach((value, key) => {
        formObj[key] = value;  // Convierte los datos del formulario en un objeto
    });
   
    // Determina si es un intento de registro o login
    const isLogin = submitButton.textContent === 'Iniciar Sesión';
    const url = isLogin ? 'http://127.0.0.1:3000/login' : 'http://127.0.0.1:3000/registro';  // Cambia la URL dependiendo de la acción
    const method = 'POST';

    // Realiza el fetch a la URL correspondiente
    fetch(url, {
        method: method,
        headers:  {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObj)  // Convierte el objeto a JSON
    })
   .then(response => response.json())
.then(data => {
    console.log('Respuesta del servidor:', data);
    if (data.success) { //PREGUNTAR 
        if (!isLogin) {
            alert('Usuario Registrado');
            //setTimeout(() => {
             ///   window.location.href = 'http://127.0.0.1:5500/index.html';
           // }, 500); // Espera 500ms antes de redirigir     
                // Limpiar sessionStorage después del envío
            sessionStorage.removeItem("formData");
            form.reset(); // Limpia el formulario
            
        } else {
            const username = form.elements['username'].value;
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('username', username);
                 // Limpiar sessionStorage después del envío  

            carritoSelect();
            window.location.href = 'http://127.0.0.1:3000/index.html';

            
          
        }
    } else {
        alert('El registro o inicio de sesión falló. ' + (data.message || 'Error desconocido.'));
    }
})
});

