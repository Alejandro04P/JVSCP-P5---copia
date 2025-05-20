
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
function carritoInsert(button){
    const productCard = button.closest('.product');
    const username = localStorage.getItem('username'); // Asume que el username está en localStorage
    const nombre_producto = productCard.querySelector('.card-title').textContent.trim(); // Obtiene el texto del producto
    const cantidad = parseInt(productCard.querySelector('.quantity').value, 10);
    const valor_unitario = parseFloat(productCard.querySelector('.card-price').textContent.replace('$', ''));
    const url = 'https://nodejs-production-0097.up.railway.app/carro';
    const rellenos = productCard.querySelector('.flavor-select');
    const relleno = rellenos.options[rellenos.selectedIndex].textContent;
    const image = productCard.querySelector('img').getAttribute('src'); // Obtén la URL de la imagen
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
     // Crear objeto del producto
     const product = {
        nombre_producto,
        valor_unitario,
        quantity: cantidad,
        relleno,
        image,
    };
    // Buscar si el producto ya existe en el carrito (comparando nombre y relleno)
    const existingProduct = cart.find(
        (item) => 
            item.nombre_producto === product.nombre_producto && 
            item.relleno === product.relleno
    );

    if (existingProduct) {
        // Si el producto existe, incrementa la cantidad
        existingProduct.quantity += product.quantity;
    } else {
        // Si no existe, agrega el producto al carrito
        cart.push(product);
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
     

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, nombre_producto, cantidad, valor_unitario,relleno,image }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {

            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Ocurrió un error al añadir al carrito');
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
