const form = document.getElementById('myForm');
const submitButton = document.getElementById('submitButton');
// Cargar datos guardados en sessionStorage al cargar la página
window.addEventListener("load", () => {
    const savedData = sessionStorage.getItem("formData");
    if (savedData) {
        const formData = JSON.parse(savedData);
        Object.keys(formData).forEach((key) => {
            const input = form.elements[key];
            if (input) input.value = formData[key]; // Carga los valores guardados
        });
    }
});

// Guardar automáticamente en sessionStorage al interactuar con los inputs
form.addEventListener("input", () => {
    const formData = new FormData(form);
    const formObj = {};
    formData.forEach((value, key) => {
        formObj[key] = value;
    });
    sessionStorage.setItem("formData", JSON.stringify(formObj)); // Guarda en sessionStorage
});

form.addEventListener('submit', function(event) {
    event.preventDefault();  // Prevenir la acción por defecto del formulario
    const formData = new FormData(form);  // Captura los datos del formulario
    const formObj = {};
    const errors = [];

    // Captura valores y valida cada campo
    const username = form.username.value.trim();
    const password = form.password.value.trim();
    const email = form.email.value.trim();
    const nombre = form.nombre.value.trim();
    const apellido = form.apellido.value.trim();
    const fechaNacimiento = form.fecha_nacimiento.value.trim();
    const telefono = form.telefono.value.trim();
    const direccion = form.direccion.value.trim();
    const genero = form.genero.value.trim();
    const ocupacion = form.ocupacion.value.trim();

    // Validaciones
    if (username.length < 3) {
        errors.push("El nombre de usuario debe tener al menos 3 caracteres.");
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)) {
        errors.push("La contraseña debe tener al menos 8 caracteres, una letra, un número y un carácter especial.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push("El correo electrónico no tiene un formato válido.");
    }

    if (!/^[a-zA-Z\s]+$/.test(nombre)) {
        errors.push("El nombre solo puede contener letras y espacios.");
    }

    if (!/^[a-zA-Z\s]+$/.test(apellido)) {
        errors.push("El apellido solo puede contener letras y espacios.");
    }

    if (!fechaNacimiento || new Date(fechaNacimiento) > new Date()) {
        errors.push("La fecha de nacimiento no puede estar vacía ni ser una fecha futura.");
    }

    if (!/^\d{10}$/.test(telefono)) {
        errors.push("El teléfono debe tener 10 dígitos.");
    }

    if (direccion.length < 5) {
        errors.push("La dirección debe tener al menos 5 caracteres.");
    }

    if (!genero) {
        errors.push("Debe seleccionar un género.");
    }

    if (!/^[a-zA-Z\s]+$/.test(ocupacion)) {
        errors.push("La ocupación solo puede contener letras y espacios.");
    }

    // Mostrar errores si existen
    if (errors.length > 0) {
        alert("Errores en el formulario:\n" + errors.join("\n"));
        return;
    }

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
            window.location.href = 'http://127.0.0.1:5500/index.html';
        }
    } else {
        alert('El registro o inicio de sesión falló. ' + (data.message || 'Error desconocido.'));
    }
})
.catch(error => {
    console.error('Error durante la solicitud:', error);
    alert('Ocurrió un error inesperado: ' + error.message);
});;

})

