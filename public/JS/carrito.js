const API_CARRITO = "/api/gestion/carrito";
const API_CARRITOUP = "/api/gestion/carrito/update";
const API_CARRITOEL = "/api/gestion/carrito/eliminar";
function displayCart() {
    const cartItemsContainer = document.querySelector('#cart-items'); // Contenedor dinámico de productos
    const totalPriceElement = document.querySelector('.total-price'); // Elemento del precio total sin IVA
    const totalIvPriceElement = document.querySelector('.total-ivprice'); // Elemento del precio total con IVA
    // Lee el carrito desde localStorage (este localStorage será actualizado por carritoSelect)
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (!cartItemsContainer || !totalPriceElement || !totalIvPriceElement) {
        console.error('No se encontraron los contenedores del carrito o del precio total.');
        return;
    }

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="datos">Tu carrito está vacío</p>';
        totalPriceElement.textContent = '$0.00';
        totalIvPriceElement.textContent = '$0.00';
        return;
    }

    // Generar contenido dinámico para cada producto
    cartItemsContainer.innerHTML = cart
        .map(
            (product) => `
            <div class="cart-item d-flex justify-content-between align-items-center mb-3">
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.imagen}" alt="${product.nombre}" class="img-thumbnail" />
                    </div>
                    <div class="product-details">
                        <h3 class="product-title">${product.nombre}</h3>
                        <p class="product-flavor">Relleno: ${product.relleno}</p>
                        <div class="quantity-selector">
                            <button class="quantity-btn" onclick="decreaseQuantity(${product.id_producto}, '${product.relleno}', this)">-</button>
                            <input 
                                type="number" 
                                class="quantity" 
                                value="${product.cantidad}" 
                                min="1" 
                                onchange="handleQuantityChange(${product.id_producto}, '${product.relleno}', this)" 
                            />
                            <button class="quantity-btn" onclick="increaseQuantity(${product.id_producto}, '${product.relleno}', this)">+</button>
                        </div>
                        <p class="product-price text-muted">Precio: $${product.valor_unitario.toFixed(2)}</p>
                    </div>
                </div>
                <button class="btn btn-danger btn-sm add-to-cart" onclick="removeCartItemAndRefresh(${product.id_producto}, '${product.relleno}', this);">Eliminar</button>
            </div>
        `
        )
        .join('');

    // Calcular el precio subtotal (sin IVA)
    var subtotalPrice = cart.reduce((total, product) => {
        const price = product.valor_unitario;
        return total + price * product.cantidad; // Usar product.cantidad aquí
    }, 0);

    totalPriceElement.textContent = `$${subtotalPrice.toFixed(2)}`; // Actualizar el subtotal con 2 decimales

    // Calcular el precio total (con IVA del 15%)
    const totalWithIvPrice = subtotalPrice * 1.15;
    totalIvPriceElement.textContent = `$${totalWithIvPrice.toFixed(2)}`; // Actualizar el total con IVA
}

function carritoSelect() {
    const username = localStorage.getItem('username');
    let userId = localStorage.getItem('idUser'); // Intenta obtener el ID de usuario del localStorage

    console.log("🛒 Inicio carritoSelect. Username:", username, "UserId inicial en localStorage:", userId);

    // 1. Si no hay username, el usuario no está logueado, el carrito está vacío.
    if (!username) {
        console.log("🛒 No hay username. Limpiando y mostrando carrito vacío.");
        localStorage.removeItem('cart'); // Limpiar cualquier dato antiguo del carrito en localStorage
        displayCart(); // Mostrar el carrito vacío en la UI
        return; // Salir de la función
    }

    // Función interna para hacer la llamada AJAX al API_CARRITO (GET)
    const fetchCartData = (currentUserId) => {
        console.log('🛒 Llamando fetchCartData para userId:', currentUserId);

        // Validación adicional del ID antes de la petición
        // Asegura que currentUserId no sea null/undefined/cero/NaN
        if (!currentUserId || isNaN(parseInt(currentUserId)) || parseInt(currentUserId) <= 0) {
            console.error('🛒 ID de usuario inválido o nulo para cargar el carrito:', currentUserId);
            localStorage.removeItem('cart'); // Limpiar carrito local
            displayCart(); // Mostrar carrito vacío
            Swal.fire({
                icon: 'warning',
                title: 'Carrito no disponible',
                text: 'No se pudo cargar el carrito sin un ID de usuario válido. Asegúrate de iniciar sesión.'
            });
            return; // Salir de la función interna
        }

        $.ajax({
            url: `${API_CARRITO}?id_usuario=${encodeURIComponent(currentUserId)}`, // <--- Aquí se usa el ID
            method: 'GET',
            dataType: 'json', // Esperamos una respuesta JSON del backend
            success: function(response) {
                console.log('🛒 Respuesta de API_CARRITO (exitosa):', response);
                if (response.success && Array.isArray(response.data)) {
                    // Asumimos que response.data es un array de ítems del carrito
                    localStorage.setItem('cart', JSON.stringify(response.data)); // Guardar los datos frescos en localStorage
                    displayCart(); // Mostrar el carrito con los datos actualizados
                    updateCartCount()
                } else {
                    console.error('🛒 Error al cargar el carrito: Respuesta inesperada del backend.', response);
                    localStorage.removeItem('cart'); // Limpiar carrito local si hay un error en la respuesta
                    displayCart(); // Mostrar carrito vacío
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de carga',
                        text: 'Respuesta inesperada al cargar el carrito.'
                    });
                }
            },
            error: function(xhr, status, error) {
                console.error('🛒 Error AJAX al cargar el carrito:', xhr.responseText, status, error);
                localStorage.removeItem('cart'); // Limpiar carrito local en caso de error de red o servidor
                displayCart(); // Mostrar carrito vacío
                Swal.fire({
                    icon: 'error',
                    title: 'Error de carga',
                    text: 'No se pudo cargar tu carrito. Intenta de nuevo más tarde.'
                });
            }
        });
    };

    // 2. Lógica para obtener o usar el userId
    // Verificamos si userId ya está en localStorage y si es un número válido y positivo
    if (userId && userId !== "null" && userId !== "undefined" && parseInt(userId) > 0) {
        console.log("🛒 userId válido encontrado en localStorage. Cargando carrito directamente.");
        fetchCartData(userId); // Usar el ID directamente
    } else {
        // Si userId no está en localStorage o no es válido, se debe obtener primero del backend
        console.log("🛒 userId no encontrado o inválido. Obteniendo de API_GET_USER_ID para username:", username);
        $.ajax({
            url: `${API_GET_USER_ID}?username=${encodeURIComponent(username)}`,
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                console.log('🛒 Respuesta de API_GET_USER_ID (exitosa):', response);
                // Asumimos que la respuesta de obtener usuario es { success: true, data: id_usuario }
                // O { success: true, id_usuario: id_usuario }
                if (response.success && (response.data || response.id_usuario)) {
                    userId = response.data || response.id_usuario; // Extrae el ID del usuario
                    localStorage.setItem("idUser", userId); // Guarda el ID en localStorage para futuras referencias
                    console.log("🛒 userId obtenido y guardado:", userId, ". Ahora cargando el carrito.");
                    fetchCartData(userId); // <--- ¡LLAMA A fetchCartData AQUÍ, DESPUÉS DE OBTENER EL ID!
                } else {
                    console.error('🛒 No se pudo obtener el ID de usuario desde el backend.', response);
                    localStorage.removeItem('idUser'); // Limpiar ID si falló
                    localStorage.removeItem('cart');
                    displayCart();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de usuario',
                        text: response.message || 'No se pudo obtener el ID de usuario. Por favor, intente iniciar sesión de nuevo.'
                    });
                }
            },
            error: function(xhr, status, error) {
                console.error('🛒 Error AJAX al obtener ID de usuario:', xhr.responseText, status, error);
                localStorage.removeItem('idUser');
                localStorage.removeItem('cart');
                displayCart();
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor para obtener la información del usuario.'
                });
            }
        });
    }
}
// --- DOMContentLoaded listener: Ejecuta funciones cuando la página carga ---
document.addEventListener('DOMContentLoaded', function() {
    // ⭐ ¡NUEVO! Llama a carritoSelect para cargar y mostrar el carrito al cargar la página ⭐
    carritoSelect();
    
});

// Función para actualizar el número de productos en el carrito
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.length;
    console.log(cartCount);
    const cartCountElement = document.querySelector('#cart-count'); // Actualiza el elemento correspondiente
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

function updateCartItemBackend(updatedProduct) {
    const userId = localStorage.getItem('idUser');

    if (!userId || isNaN(parseInt(userId))) {
        console.error('No se pudo obtener el ID de usuario para actualizar el carrito en el backend.');
        Swal.fire({
            icon: 'error',
            title: 'Error de usuario',
            text: 'Necesitas iniciar sesión para actualizar tu carrito.'
        });
        return;
    }

    const dataToSend = {
        id_usuario: parseInt(userId),
        id_producto: updatedProduct.id_producto,
        nombre: updatedProduct.nombre,
        relleno: updatedProduct.relleno,
        valor_unitario: updatedProduct.valor_unitario,
        cantidad: updatedProduct.cantidad,
        imagen: updatedProduct.imagen,
    };

    console.log('Datos a enviar para actualizar/añadir en backend:', dataToSend);

    $.ajax({
        url: API_CARRITOUP, // Endpoint POST que maneja añadir o actualizar
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(dataToSend),
        success: function(response) {
            if (response == "OK") {
                console.log('🛒 Cantidad de producto actualizada en el backend.');
            } else {
                console.error('🛒 Error al actualizar la cantidad en el backend:', response.message || response);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Hubo un error al actualizar la cantidad en el carrito.'
                });
                carritoSelect(); // Recargar el carrito desde el backend para sincronizar
            }
        },
        error: function(xhr, status, error) {
            console.error('🛒 Error AJAX al actualizar la cantidad:', xhr.responseText, status, error);
            let errorMessage = 'Hubo un error de conexión al actualizar el carrito.';
            try {
                const errorResponse = JSON.parse(xhr.responseText);
                if (errorResponse && errorResponse.message) {
                    errorMessage = errorResponse.message;
                }
            } catch (e) {}
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: errorMessage
            });
            carritoSelect(); // Recargar el carrito desde el backend para sincronizar
        }
    });
}


// --- handleQuantityChange (Maneja el cambio manual en el input) ---
function handleQuantityChange(productId, relleno, inputElement) {
    let newQuantity = parseInt(inputElement.value);

    if (isNaN(newQuantity) || newQuantity < 1) {
        newQuantity = 1;
        inputElement.value = 1; // Corrige el valor en la UI
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(
        (item) => item.id_producto === productId && item.relleno === relleno
    );

    if (productIndex !== -1) {
        const product = cart[productIndex];
        // Solo actualiza si la cantidad es realmente diferente
        if (product.cantidad !== newQuantity) {
            product.cantidad = newQuantity; // Actualiza el objeto en el carrito local
            localStorage.setItem('cart', JSON.stringify(cart)); // Guarda en localStorage

            // LLAMADA AL BACKEND: Solo aquí, cuando el usuario termina de escribir
            updateCartItemBackend(product);
        }
    } else {
        console.warn('Producto no encontrado en el carrito local al cambiar cantidad manualmente.');
    }

    displayCart();     // Refresca la UI
    updateCartCount(); // Actualiza el contador
}

function removeCartItemAndRefresh(productId, relleno, button) {
    const confirmDelete = window.confirm('¿Estás seguro?\n¿Deseas eliminar este producto de tu carrito?');
    if(confirmDelete){
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Filtra el producto a eliminar
    const initialLength = cart.length;
    cart = cart.filter(item => !(item.id_producto === productId && item.relleno === relleno));

    if (cart.length < initialLength) { // Si se eliminó algo
        localStorage.setItem('cart', JSON.stringify(cart)); // Actualiza localStorage

        // --- Llama a tu backend para eliminar el producto ---
        const userId = localStorage.getItem('idUser');
        if (userId && !isNaN(parseInt(userId))) {
            $.ajax({
                url: `${API_CARRITOEL}?id_usuario=${userId}&id_producto=${productId}`,
                method: 'DELETE', // O POST si tu backend lo prefiere
                success: function(response) {
                    if (response) { // O response.success, etc.
                        Swal.fire({
                            toast: true, position: 'top-end', icon: 'success',
                            title: 'Producto eliminado del carrito', showConfirmButton: false, timer: 1500
                        });
                        console.log('🛒 Producto eliminado del backend.');
                    } else {
                        console.error('🛒 Error al eliminar del backend:', response.message || response);
                        Swal.fire('Error', 'No se pudo eliminar el producto del servidor.', 'error');
                    }
                },
                error: function(xhr, status, error) {
                    console.error('🛒 Error AJAX al eliminar:', xhr.responseText, status, error);
                    Swal.fire('Error', 'Error de conexión al eliminar del carrito.', 'error');
                }
            });
        }
        // --- Fin de la llamada al backend ---

        displayCart();     // Refresca la UI
        updateCartCount(); // Actualiza el contador
    }
    }
    
}
