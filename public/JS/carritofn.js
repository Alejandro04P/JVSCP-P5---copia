const API_GET_USER_ID = "/api/gestion/usuarios/user"; 
const API_CARRITOS = "/api/gestion/carrito";

// carritofn.js


function addToCart(buttonElement) {
    // 1. Obtener datos directamente de los atributos data- del botón
    const productId = $(buttonElement).data('product-id');
    const productName = $(buttonElement).data('product-name');
    const productPrice = parseFloat($(buttonElement).data('product-price'));
    const productImage = $(buttonElement).data('product-image');
    const selectedFlavor = $(buttonElement).data('product-flavor');

    // Obtener la cantidad del input dentro del quantity-selector
    const quantity = parseInt($(buttonElement).siblings('.quantity-selector').find('.quantity').val(), 10);

    // Obtener el username del localStorage
    const username = localStorage.getItem('username');

    // 2. Validación inicial: Asegurarse de que tenemos la información mínima necesaria
    if (!productId || !productName || isNaN(productPrice) || isNaN(quantity) || quantity < 1 || !username || !productImage || !selectedFlavor) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Información del producto o nombre de usuario incompleta. Por favor, asegúrese de haber iniciado sesión y que todos los datos del producto estén disponibles.'
        });
        return; // Detener la ejecución si la validación falla
    }

    // --- Lógica para obtener el userId (optimizado con localStorage) ---
    let userId = localStorage.getItem('idUser'); // Intenta obtener el userId de localStorage

    if (userId) {
        // Si el userId ya está en localStorage, procede directamente a añadir al carrito
        console.log("UserID encontrado en localStorage. Procediendo con la operación del carrito.");
        // Llama a la función que maneja el envío al backend
        proceedToAddToCartBackend(userId, productId, productName, productPrice, quantity, selectedFlavor, productImage,selectedFlavor);
    } else {
        // Si el userId NO está en localStorage, haz la llamada GET al backend para obtenerlo
        console.log("UserID no encontrado en localStorage. Obteniendo del backend...");
        $.ajax({
            url: `${API_GET_USER_ID}?username=${encodeURIComponent(username)}`,
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.success && response.id_usuario) {
                    const retrievedUserId = response.id_usuario; // Usar una variable diferente para evitar confusión
                    localStorage.setItem("idUser", retrievedUserId); // <-- **CORRECCIÓN DE SINTAXIS Y VARIABLE AQUÍ**
                    console.log("UserID obtenido del backend y guardado en localStorage:", retrievedUserId);
                    // Llama a la función que maneja el envío al backend con el userId obtenido
                    proceedToAddToCartBackend(retrievedUserId, productId, productName, productPrice, quantity, selectedFlavor, productImage);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de usuario',
                        text: response.message || 'No se pudo obtener el ID de usuario. Por favor, intente iniciar sesión de nuevo.'
                    });
                }
            },
            error: function(xhr, status, error) {
                console.error('Error al obtener el ID de usuario:', xhr.responseText);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor para obtener la información del usuario. Intente de nuevo más tarde.'
                });
            }
        });
    }
}

// Función auxiliar para manejar la lógica de envío del item al backend
// Se extrae para evitar duplicación de código y mejorar la claridad.
function proceedToAddToCartBackend(userId, productId, productName, productPrice, quantity, selectedFlavor, productImage,rellenos) {
    // Construye el objeto cartItem aquí, asegurándote de que `userId` es el correcto.
    const cartItem = {
        id_usuario: userId, // ID del usuario, ya sea de localStorage o del backend
        id_producto: productId,
        valor_unitario: productPrice,
        cantidad: quantity, // Envía la cantidad que se está añadiendo (el backend la sumará si ya existe)
        imagen: productImage, // Incluir imagen para el backend
        estado_carrito: 'ACT',
        fecha_agregado: new Date().toISOString(),
        nombre: productName,
        relleno: rellenos,
    };
    console.log("Item a enviar al backend para operación de carrito:", cartItem);

    // Paso final: Realizar la petición AJAX para añadir el producto al carrito
    $.ajax({
        url: API_CARRITOS, // Asegúrate de que API_CARRITO apunta al endpoint correcto
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(cartItem),
        success: function(response) {
            if (response == "OK") {
                Swal.fire({
                    icon: 'success',
                    title: '¡Operación Exitosa!',
                    text: response.message || `${productName} (${selectedFlavor}) x ${quantity} ha sido añadido/actualizado en tu carrito.`
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Hubo un error en la operación del carrito.'
                });
            }
        },
        error: function(xhr, status, error) {
            console.error('Error al añadir al carrito:', xhr.responseText);
            let errorMessage = 'Hubo un error al añadir el producto al carrito.';
            try {
                const errorResponse = JSON.parse(xhr.responseText);
                if (errorResponse && errorResponse.message) {
                    errorMessage = errorResponse.message;
                }
            } catch (e) {
                // Si responseText no es JSON válido, usar el mensaje genérico
            }
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage
            });
        }
    });
}
function carritoRemove(button){
    const productCard = button.closest('.cart-item'); // Encuentra el contenedor del producto
    const username = localStorage.getItem('username'); // Obtener el username almacenado
    const nombre_producto = productCard.querySelector('.product-title').textContent.trim(); // Obtiene el texto del producto
    const relleno = productCard.querySelector('.product-flavor').textContent
    .replace('Relleno: ', '') // Reemplaza "Relleno: " con una cadena vacía
    .trim(); // Elimina espacios en blanco adicionales'
    const url = 'https://nodejs-production-0097.up.railway.app/carrorem';
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Filtrar los productos que no coincidan con el que se desea eliminar
    cart = cart.filter(
        (item) =>
            !(item.nombre_producto === nombre_producto && item.relleno === relleno)
    );

    
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            nombre_producto,
            relleno,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert('Producto eliminado del carrito');
                // Actualizar el localStorage
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const updatedCart = cart.filter(
                    (item) =>
                        !(item.nombre_producto === nombre_producto && item.relleno === relleno)
                );
                localStorage.setItem('cart', JSON.stringify(updatedCart));

                // Actualizar la interfaz
                displayCart();
                updateCartCount();
            } else {
                alert('Error al eliminar el producto: ' + data.message);
            }
        })
        .catch((error) => {
            console.error('Error al eliminar el producto:', error);
            alert('Error interno del servidor');
        });

}



function facturaUser() { 
    const form = document.getElementById('datos-pay');
    form.addEventListener('submit', function(event) {
        event.preventDefault();  // Prevenir la acción por defecto del formulario
        try {
            Swal.fire({
                title: 'Pago exitoso',
                text: 'El producto se ha comprado con éxito',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                padding: '1rem', // Reduce el padding interno
                customClass: {
                    popup: 'swal-popup-custom' // Clase personalizada para ajustar estilos
                },
                backdrop: `rgba(0,0,0,0.5)`, // Ajusta la opacidad del fondo
                allowOutsideClick: true // Permitir clic fuera de la alerta
            }).then((result) => {
                if (result.isConfirmed || result.dismiss === Swal.DismissReason.backdrop) {
                    // Redirigir al usuario después de cerrar la alerta o hacer clic fuera
                    window.location.href = 'https://nodejs-production-0097.up.railway.app/index.html';
                }
            });
        } catch (error) {
            alert(error);
        }
    });
    createFac();
}

function createFac() {
    const username = localStorage.getItem('username');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (!username || cart.length === 0) {
        alert('El usuario no está logueado o el carrito está vacío.');
        return;
    }

    const url = 'https://nodejs-production-0097.up.railway.app/factura';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, cart }), // Enviar carrito y usuario al servidor
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert('Factura y detalles insertados con éxito');
                localStorage.removeItem('cart'); // Limpiar el carrito después de la compra
                window.location.href = 'https://nodejs-production-0097.up.railway.app/index.html'; // Redirigir al inicio
            } else {
                alert('Stock Insuficiente: ' + data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
