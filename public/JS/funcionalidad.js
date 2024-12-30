function addToCart(button) {
    const productCard = button.closest('.product');
    const title = productCard.querySelector('.card-title').textContent;
    const price = productCard.querySelector('.card-price').textContent;
    const quantity = productCard.querySelector('.quantity').value;
    const flavorSelect = productCard.querySelector('.flavor-select');
    const flavor = flavorSelect.options[flavorSelect.selectedIndex].textContent;
    const image = productCard.querySelector('img').getAttribute('src'); // Obtén la URL de la imagen

    // Crear objeto del producto
    const product = {
        title,
        price,
        quantity: parseInt(quantity),
        flavor,
        image, // Guarda la URL de la imagen
    };

    // Recuperar carrito actual del localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Verificar si el producto ya existe en el carrito
    const existingProduct = cart.find(
        (item) => item.title === product.title && item.flavor === product.flavor
    );

    if (existingProduct) {
        existingProduct.quantity += product.quantity; // Incrementa la cantidad si ya existe
    } else {
        cart.push(product); // Agrega el producto si no existe
    }

    // Guardar carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Actualizar la cantidad de productos en el carrito
    updateCartCount();

    Swal.fire({
        title: 'Producto añadido',
        text: 'El producto se ha añadido correctamente al carrito',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        padding: '1rem', // Reduce el padding interno
        customClass: {
            popup: 'swal-popup-custom' // Clase personalizada para ajustar estilos
        },
        backdrop: `rgba(0,0,0,0.5)` // Ajusta la opacidad del fondo
    });
    
    
       
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, product) => total + product.quantity, 0);
    const cartCountElement = document.querySelector('#cart-count'); // Actualiza el elemento correspondiente
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}


