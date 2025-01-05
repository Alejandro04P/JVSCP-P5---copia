function addToCart(button) {
    // Actualizar la cantidad de productos en el carrito
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


