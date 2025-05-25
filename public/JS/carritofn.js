
 function carritoUpdate(button) {
    const productCard = button.closest('.cart-item'); // Encuentra el contenedor del producto
    const quantity = parseInt(productCard.querySelector('.quantity').value, 10); // Nueva cantidad
    const username = localStorage.getItem('username'); // Obtener el username almacenado
    const nombre_producto = productCard.querySelector('.product-title').textContent.trim(); // Obtiene el texto del producto
    const relleno = productCard.querySelector('.product-flavor').textContent
    .replace('Relleno: ', '') // Reemplaza "Relleno: " con una cadena vacía
    .trim(); // Elimina espacios en blanco adicionales

    fetch('https://nodejs-production-0097.up.railway.app/carroup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            cantidad: quantity, // Cantidad actualizada
            nombre_producto,
            relleno
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                console.log(data.message);
           
            } else {
                console.error(data.message);
                alert('Error al actualizar el carrito');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
// carritofn.js

function addToCart(buttonElement) {
    const productId = $(buttonElement).data('product-id');
    const productName = $(buttonElement).data('product-name');
    const productPrice = $(buttonElement).data('product-price');
    const quantity = $(buttonElement).siblings('.quantity-selector').find('.quantity').val();
    const selectedFlavor = $(buttonElement).siblings('.flavor-select').val();

    // Basic validation
    if (!productId || !productName || !productPrice || !quantity || quantity < 1) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Información del producto incompleta. Por favor, intente de nuevo.'
        });
        return;
    }

    const cartItem = {
        productoId: productId, // Assuming your API expects 'productoId'
        nombre: productName,
        precioUnitario: parseFloat(productPrice), // Ensure price is a number
        cantidad: parseInt(quantity), // Ensure quantity is an integer
        saborRelleno: selectedFlavor // Add the selected flavor/filling
    };

    $.ajax({
        url: 'http://tiendabackend.runasp.net/api/gestion/carrito',
        method: 'POST',
        contentType: 'application/json', // Important for sending JSON data
        data: JSON.stringify(cartItem), // Convert the JavaScript object to a JSON string
        success: function(response) {
            Swal.fire({
                icon: 'success',
                title: '¡Añadido al carrito!',
                text: `${productName} (${selectedFlavor}) x ${quantity} ha sido añadido a tu carrito.`
            });
            // You might want to update a cart icon counter here
        },
        error: function(xhr, status, error) {
            console.error('Error adding to cart:', xhr.responseText);
            let errorMessage = 'Hubo un error al añadir el producto al carrito.';
            try {
                const errorResponse = JSON.parse(xhr.responseText);
                if (errorResponse && errorResponse.message) {
                    errorMessage = errorResponse.message;
                }
            } catch (e) {
                // If responseText is not valid JSON, use generic message
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
