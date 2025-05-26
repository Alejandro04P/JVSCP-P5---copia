// Este código debería ir en tu 'login.js' (si es el script que va a manejar este form)
// o en 'iniciarsecion.js' si es donde tienes la lógica de login.

const API_LOGIN_URL = "/api/gestion/usuarios/login";

// Asegúrate de que este selector coincide con el ID de tu formulario de login.
// Si usas 'myForm' para login, asegúrate de que no haya conflicto con el formulario de registro.
const form = document.getElementById('myForm'); // <-- Apunta al ID de tu formulario

if (form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // ¡Esto es clave para evitar el POST por defecto del navegador!

        const username = form.username.value.trim();
        const password = form.password.value.trim();

        if (!username || !password) {
            alert("Por favor, ingresa tu nombre de usuario y contraseña.");
            return;
        }

        const formObj = {
            username: username,
            password: password
        };

        fetch(API_LOGIN_URL, {
            method: 'POST', // Aquí se define el método POST para el fetch
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formObj)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.Message || 'Error en la solicitud de login.'); });
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor (Login):', data);
            if (data.Message === true) {
                localStorage.removeItem("cart");
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('username', username);
                form.reset();
                window.location.href = '/index.html'; // Redirige a la página principal (index.html)

            } else {
                alert('Inicio de sesión fallido. Usuario o contraseña incorrectos.');
            }
        })
        .catch(error => {
            console.error('Error durante la solicitud de login:', error);
            alert('Ocurrió un error inesperado al intentar iniciar sesión: ' + error.message);
        });
    });
} else {
    console.error("No se encontró el formulario con ID 'myForm' para el login.");
}