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
                    <img src="${product.image}" alt="${product.title}" class="img-thumbnail" />
                </div>
                <div class="product-details">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-flavor">Relleno: ${product.flavor}</p>
                    <div class="quantity-selector">
                        <button class="quantity-btn" onclick="decreaseQuantity('${product.title}', '${product.flavor}'); carritoUpdate(this);">-</button>
                        <input type="number" class="quantity" value="${product.quantity}" min="1" readonly />
                        <button class="quantity-btn" onclick="increaseQuantity('${product.title}', '${product.flavor}'); carritoUpdate(this);">+</button>
                    </div>
                    <p class="product-price text-muted">Precio: $${product.price}</p>
                </div>
            </div>
            <button class="btn btn-danger btn-sm add-to-cart" onclick="removeFromCart('${product.title}', '${product.flavor}')">Eliminar</button>
        </div>
    `
    )
    .join('');

    // Calcular el precio total
    var totalPrice = cart.reduce((total, product) => {
        const price = parseFloat(product.price.replace('$', ''));
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
    cart = cart.filter((product) => product.title !== title || product.flavor !== flavor);

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

// Llamar a las funciones necesarias al cargar la página del carrito
document.addEventListener('DOMContentLoaded', () => {
    displayCart();
    updateCartCount();
});


