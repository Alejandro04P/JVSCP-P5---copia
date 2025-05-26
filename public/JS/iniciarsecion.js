// Este código debería ir en tu archivo iniciarsecion.js

// Lógica de inicialización al cargar la página
// Esto se ejecuta una vez al cargar la página para establecer el estado inicial de la navbar
if (localStorage.getItem('loggedIn') === 'true') {
    const username = localStorage.getItem('username');
    updateNavbar(true, username); // Actualizamos la navbar con el usuario logueado
} else {
    updateNavbar(false, ''); // Si no está logueado, mostramos los botones de login/registro
}

// Función para actualizar la barra de navegación
function updateNavbar(isLoggedIn, username) {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    // Es una buena práctica verificar si los elementos existen antes de manipularlos
    if (!loginBtn || !registerBtn) {
        console.warn("Elementos 'loginBtn' o 'registerBtn' no encontrados en el DOM.");
        return;
    }

    // Clonamos el botón de registro para eliminar y volver a añadir el event listener
    // Esto previene que se acumulen múltiples listeners en cada llamada a updateNavbar.
    const registerClone = registerBtn.cloneNode(true);
    registerBtn.parentNode.replaceChild(registerClone, registerBtn);

    if (isLoggedIn) {
        // Estado: Logueado
        loginBtn.textContent = username; // Cambiar texto de 'Iniciar sesión' por el nombre de usuario
        loginBtn.setAttribute('href', '#'); // Ya no redirige a la página de login, es solo un texto o un enlace a perfil

        registerClone.textContent = 'Cerrar Sesión'; // Cambiar 'Crear cuenta' por 'Cerrar sesión'
        registerClone.setAttribute('href', '#'); // No redirige a la página de registro

        // Agregar la lógica de cierre de sesión al botón clonado
        registerClone.addEventListener('click', function(event) {
            event.preventDefault(); // Prevenir la acción por defecto del enlace

            // Limpiar datos de sesión
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('cart'); // ✅ Mantenemos la limpieza del carrito

            // Actualizar la navbar y redirigir a la página principal
            updateNavbar(false, ''); // Vuelve a mostrar los botones de login/registro
            // ✅ ADAPTADO: Usamos la ruta absoluta desde la raíz de 'public'
            window.location.href = '/index.html'; // Redirige a la página principal
        });

    } else {
        // Estado: No logueado
        loginBtn.textContent = 'Iniciar Sesión'; // Volver a mostrar 'Iniciar sesión'
        // ✅ ADAPTADO: Usamos la ruta absoluta desde la raíz de 'public'
        loginBtn.setAttribute('href', '/html/iniciar.html'); // Redirige a la página de login

        registerClone.textContent = 'Crear Cuenta'; // Volver a mostrar 'Crear cuenta'
        // ✅ ADAPTADO: Usamos la ruta absoluta desde la raíz de 'public'
        registerClone.setAttribute('href', '/html/registro.html'); // Redirige a la página de registro
    }
}