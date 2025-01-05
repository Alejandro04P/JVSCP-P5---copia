function displayCart() {
    const cartItemsContainer = document.querySelector('#cart-items'); // Contenedor dinámico de productos
    const totalPriceElement = document.querySelector('.total-price'); // Elemento del precio total
    const totalIvPriceElement = document.querySelector('.total-ivprice'); // Elemento del precio total
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (!cartItemsContainer || !totalPriceElement) {
        console.error('No se encontraron los contenedores del carrito o del precio total.');
        return;
    }

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="datos">Tu carrito está vacío</p>';
        totalPriceElement.textContent = '$0.00'; // Actualizar total a $0.00
        totalIvPriceElement.textContent = '$0.00'
        return;
    }

    // Generar contenido dinámico para cada producto
    cartItemsContainer.innerHTML = cart
    .map(
        (product) => `
        <div class="cart-item d-flex justify-content-between align-items-center mb-3">
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.nombre_producto}" class="img-thumbnail" />
                </div>
                <div class="product-details">
                    <h3 class="product-title">${product.nombre_producto}</h3>
                    <p class="product-flavor">Relleno: ${product.relleno}</p>
                    <div class="quantity-selector">
                        <button class="quantity-btn" onclick="decreaseQuantity('${product.nombre_producto}', '${product.relleno}', this)">-</button>
                        <input type="number" class="quantity" value="${product.quantity}" min="1" readonly />
                        <button class="quantity-btn" onclick="increaseQuantity('${product.nombre_producto}', '${product.relleno}', this)">+</button>
                    </div>
                    <p class="product-price text-muted">Precio: $${product.valor_unitario.toFixed(2)}</p>
                </div>
            </div>
            <button class="btn btn-danger btn-sm add-to-cart" onclick="carritoRemove(this);removeFromCart('${product.nombre_producto}', '${product.relleno}');">Eliminar</button>
        </div>
    `
    )
    .join('');

    // Calcular el precio total
    var totalPrice = cart.reduce((total, product) => {
        const price = product.valor_unitario;
        return total + price * product.quantity;
    }, 0);
    
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`; // Actualizar el total con 2 decimales
    totalPrice = totalPrice + (totalPrice * 15/100);
    totalIvPriceElement.textContent = `$${totalPrice.toFixed(2)}`; // Actualizar el total con 2 decimales

}
// Función para actualizar el número de productos en el carrito
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, product) => total + product.quantity, 0);
    const cartCountElement = document.querySelector('#cart-count'); // Actualiza el elemento correspondiente
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Función para eliminar un producto del carrito
function removeFromCart(title, flavor) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Filtrar los productos que no coincidan con el producto a eliminar
    cart = cart.filter((product) => product.nombre_producto !== title || product.relleno !== flavor);

    // Guardar carrito actualizado en localStorage
    if (cart.length === 0) {
        // Si el carrito está vacío después de eliminar, remover la clave del localStorage
        localStorage.removeItem('cart');
    } else {
        // Guardar carrito actualizado en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Actualizar la vista y el contador del carrito
    displayCart();
    updateCartCount();
}

// Función que inicializa los datos del carrito
function initializeCartPage() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const usuario = localStorage.getItem('username');
    if (window.location.pathname.includes('carrito.html')) { // Detecta si estás en carrito.html    
        if(usuario != null){     
            carritoSelect();
            displayCart();
            updateCartCount();
        }
    }else if (window.location.pathname.includes('index.html')) {
        if(usuario != null){     
            carritoSelect();
        }
    }
}

// Detecta la carga inicial
document.addEventListener('DOMContentLoaded', () => {
    initializeCartPage();
});
// Detecta cambios en la URL para Single Page Applications (SPA)
window.addEventListener('popstate', () => {
    initializeCartPage();
});
function carritoSelect() {
    const user = localStorage.getItem('username'); // Obtener el username almacenado
    fetch(`https://nodejs-production-0097.up.railway.app/carrose?user=${encodeURIComponent(user)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
               // Supongamos que `data.carrito` contiene tu JSON
                const carrito = data.carrito || []; // Asegúrate de que exista data.carrito para evitar errores
                // Mapeo del JSON al formato de `product`
                const cart = carrito.map((item) => {
                    return {
                        nombre_producto: item.pro_descripcion.trim(), // Nombre del producto
                        valor_unitario: parseFloat(item.valor_unitario), // Precio unitario como número
                        quantity: parseInt(item.cantidad, 10), // Cantidad
                        relleno: item.pro_relleno.trim(), // Relleno sin espacios adicionales
                        image: item.imagen.trim() // URL de la imagen
                    };
                });
                // Sobrescribir el carrito en el localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
                console.log('Carrito guardado en localStorage:', data.carrito);
                // Cargar el carrito dinámicamente en la página
        
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Ocurrió un error al cargar el carrito');
        });
}

