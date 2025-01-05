if (localStorage.getItem('loggedIn') === 'true') {
    const username = localStorage.getItem('username');
    updateNavbar(true, username);  // Actualizamos la navbar con el usuario logueado
} else {
    updateNavbar(false, '');  // Si no está logueado, mostramos los botones de login/registro
}

// Función para actualizar la barra de navegación
// Función para actualizar la barra de navegación
function updateNavbar(isLoggedIn, username) {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    // Eliminamos cualquier event listener previo del botón "Cerrar Sesión"
    const registerClone = registerBtn.cloneNode(true); // Clonar el botón para reiniciar eventos
    registerBtn.parentNode.replaceChild(registerClone, registerBtn);

    if (isLoggedIn) {
        loginBtn.textContent = username;  // Cambiar texto de 'Iniciar sesión' por el nombre de usuario
        loginBtn.setAttribute('href', '#');  // Ya no redirige a la página de login

        registerClone.textContent = 'Cerrar Sesión';  // Cambiar 'Crear cuenta' por 'Cerrar sesión'
        registerClone.setAttribute('href', '#');  // No redirige a la página de registro

        // Agregar la lógica de cierre de sesión
        registerClone.addEventListener('click', function(event) {
            event.preventDefault();
            localStorage.removeItem('loggedIn');  // Eliminar el estado de sesión
            localStorage.removeItem('username');  // Eliminar el nombre de usuario
            updateNavbar(false, '');  // Volver a mostrar los botones de login/registro
            localStorage.removeItem('cart');// miraaaaaaaaaaa
            window.location.href = 'http://127.0.0.1:3000/index.html';   
        });

    } else {
        loginBtn.textContent = 'Iniciar Sesión';  // Volver a mostrar 'Iniciar sesión'
        loginBtn.setAttribute('href', '../dataserv/iniciar.html');  // Redirige a la página de login

        registerClone.textContent = 'Crear Cuenta';  // Volver a mostrar 'Crear cuenta'
        registerClone.setAttribute('href', '../dataserv/registro.html');  // Redirige a la página de registro
    }
}
