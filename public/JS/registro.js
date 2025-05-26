// Este código debería ir en un archivo JS para el registro, por ejemplo, 'registro.js'
// y ser enlazado en tu página de registro (donde está <form id="myForm">).

// Define la URL para la API de Registro a través del proxy de Node.js
const API_REGISTRO_URL = "/api/gestion/usuarios"; // Apunta a http://localhost:3000/api/gestion/usuarios

const form = document.getElementById('myForm'); // Este es tu formulario de registro
// const submitButton = document.getElementById('submitButton'); // Ya no es necesario para diferenciar login/registro aquí

// Cargar datos guardados en sessionStorage al cargar la página
window.addEventListener("load", () => {
    const savedData = sessionStorage.getItem("formData");
    if (savedData) {
        const formData = JSON.parse(savedData);
        Object.keys(formData).forEach((key) => {
            const input = form.elements[key];
            if (input) input.value = formData[key];
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
    sessionStorage.setItem("formData", JSON.stringify(formObj));
});

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir la acción por defecto del formulario

    const errors = [];

    // Captura valores y valida CADA CAMPO (porque es el formulario de REGISTRO)
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

    // Validaciones para TODOS los campos de REGISTRO
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

    // Preparar el objeto con TODOS los datos para enviar al backend (Registro)
    const formObj = {
        username: username,
        password: password,
        email: email,
        nombre: nombre,
        apellido: apellido,
        fecha_nacimiento: fechaNacimiento,
        telefono: telefono,
        direccion: direccion,
        genero: genero,
        ocupacion: ocupacion
    };
 console.log(formObj)
    // Realiza el fetch a la URL de REGISTRO
    fetch(API_REGISTRO_URL, {
        method: 'POST', // Siempre POST para registro
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObj) // Envía todos los datos
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.Message || 'Error en la solicitud de registro.'); });
        }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta del servidor (Registro):', data);
        // ✅ CORRECCIÓN: Compara con el mensaje EXACTO que viene del backend
        if (data.Message === "Usuario insertado correctamente") { //
            alert('Usuario Registrado exitosamente!');
            sessionStorage.removeItem("formData"); // Limpiar sessionStorage
            form.reset(); // Limpia el formulario

            // ¡Asegúrate de DESCOMENTAR una de estas líneas para que haya una redirección!
            window.location.href = '/html/iniciar.html'; // Opción 1: Redirigir a la página de login
            // O
            // window.location.href = '/index.html'; // Opción 2: Redirigir a la página principal

        }else {
                alert('Error al registrar usuario: ' + (data.Message || 'Error desconocido.'));
            }
        })
    .catch(error => {
        console.error('Error durante la solicitud de registro:', error);
        alert('Ocurrió un error inesperado al registrar usuario: ' + error.message);
    });
});