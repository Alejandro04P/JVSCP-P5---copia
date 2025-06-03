// funcionalidad.js

// Si tienes estas constantes definidas en este archivo,
// asegúrate de que apunten a la ruta relativa que el proxy manejará.
// Por ejemplo:
const API_PRODUCTOS = "/api/gestion/productos";
// const API_USUARIOS = "/api/gestion/usuarios"; // Si también las usas aquí
document.addEventListener('DOMContentLoaded', function() {
    // Ya no necesitas obtener la categoría de los parámetros de la URL
    // const urlParams = new URLSearchParams(window.location.search);
    // const categoriaIdSeleccionada = urlParams.get('categoria'); 
    // ✅ Nueva lógica: Detecta en qué archivo HTML estás y asigna la categoría correspondiente
    const currentPath = window.location.pathname;
    let categoriaACargar = null; // Inicializamos a null

    if (currentPath.includes('/pasteles.html')) {
        categoriaACargar = 1; // Por ejemplo, 1 para Pasteles
    } else if (currentPath.includes('/donas.html')) {
        categoriaACargar = 2; // Por ejemplo, 2 para Donas
    } else if (currentPath.includes('/galletas.html')) {
        categoriaACargar = 3; // Por ejemplo, 3 para Galletas
    }
    // Puedes añadir más 'else if' para otras categorías si las tienes

    // Solo si se encontró una categoría válida para la página actual
    if (categoriaACargar !== null) {
        cargarProductosPorCategoria(categoriaACargar);
    } else {
        // Mensaje si no estás en una página de categoría conocida
        console.log("No se encontró una página de categoría conocida (pasteles.html, donas.html, galletas.html) en la ruta.");
        // Opcional: Podrías cargar todos los productos aquí si esta es una página general
        // cargarProductosPorCategoria(null); // O un valor que indique "todos" en tu backend
    }
});


function cargarProductosPorCategoria(categoriaATraer) {
    // Convertimos el ID de la categoría a un número entero para una comparación segura
    const idNumericoCategoria = parseInt(categoriaATraer);
    console.log(idNumericoCategoria)
    $.ajax({
        // ✅ ¡CAMBIO CRÍTICO AQUÍ!
        // La URL debe apuntar a tu servidor Node.js (el proxy)
        // que está sirviendo el frontend y reenviando las peticiones.
        // Usamos la constante API_PRODUCTOS que se resuelve a "/api/gestion/productos"
        url: API_PRODUCTOS, // Esto se resolverá como http://localhost:3000/api/gestion/productos
        method: 'GET',
        dataType: 'json',
        success: function(todosLosProductos) {
            const productGrid = $('.product-grid');
            productGrid.empty(); // Limpiar el contenido existente

            // Filtrar los productos recibidos por la categoría deseada
            const productosFiltrados = todosLosProductos.filter(producto => {
                // Asegúrate de que el nombre de la propiedad 'categoria' y su valor
                // coincidan exactamente con lo que tu API devuelve.
                return producto.categoriaid === idNumericoCategoria; // Usamos el ID numérico para comparar
            });
            console.log(productosFiltrados);
            if (productosFiltrados.length === 0) {
                productGrid.append('<p>No hay productos disponibles en esta categoría.</p>');
                return;
            }

            // Iterar y mostrar solo los productos filtrados
            productosFiltrados.forEach(producto => {
                const productHtml = `
                    <div class="product">
                        <img src="${producto.img}" alt="${producto.pro_nombre}">
                        <h3 class="card-title">${producto.pro_nombre}</h3>
                        <h3 class="card-price">$${producto.pro_precio_venta.toFixed(2)}</h3>
                        <p>Relleno:</p>
                        <h3 class="card-title">${producto.pro_relleno}</h3>           
                        <div class="quantity-selector">
                            <button class="quantity-btn" onclick="decreaseQuantity(this)">-</button>
                            <input type="number" class="quantity" value="1" min="1" />
                            <button class="quantity-btn" onclick="increaseQuantity(this)">+</button>
                        </div>
                        <button class="add-to-cart"
                            data-product-id="${producto.id_producto}"
                            data-product-name="${producto.pro_nombre}"
                            data-product-price="${producto.pro_precio_venta.toFixed(2)}"
                            data-product-image="${producto.img}"       data-product-flavor="${producto.pro_relleno}" onclick="addToCart(this)">Añadir al carrito</button>
                    </div>
                `;
                productGrid.append(productHtml);
            });
        },
        error: function(error) {
            console.error('Error al cargar los productos:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los productos. Inténtalo de nuevo más tarde.'
            });
        }
    });
}

// Las funciones increaseQuantity y decreaseQuantity no necesitan cambios aquí.
// Asegúrate de que addToCart en carritofn.js también use la ruta relativa para el proxy.
// Las funciones increaseQuantity y decreaseQuantity siguen igual,
// y addToCart (que maneja el POST al carrito) sigue en carritofn.js
function increaseQuantity(button) {
    let quantityInput = $(button).prev('.quantity');
    quantityInput.val(parseInt(quantityInput.val()) + 1);
}

function decreaseQuantity(button) {
    let quantityInput = $(button).next('.quantity');
    if (quantityInput.val() > 1) {
        quantityInput.val(parseInt(quantityInput.val()) - 1);
    }
}