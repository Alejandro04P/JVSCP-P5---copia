

// Aplicar el fondo guardado al cargar la página
window.onload = function () {
    const fondoGuardado = localStorage.getItem('fondo'); // Recuperar preferencia guardada
    const elementos1 = document.querySelectorAll('.product-item1'); // Seleccionar todos los elementos con la clase 'datos'
    const elementos = document.querySelectorAll('.product-item'); // Seleccionar todos los elementos con la clase 'product-item'

    if (fondoGuardado === 'imagenes/patron.png') {
        document.body.style.backgroundImage = "url('imagenes/patron.png')";

        // Aplicar color claro al cargar
        elementos.forEach((elemento) => {
            elemento.style.backgroundColor = '#fff7f0';
        });
        elementos1.forEach((elemento) => {
            elemento.style.backgroundColor = '#e7c8a3';
        });
    } else {
        document.body.style.backgroundImage = "url('imagenes/back.jpg')";

        // Aplicar color oscuro al cargar
        elementos.forEach((elemento) => {
            elemento.style.backgroundColor = '#e7c8a3';
        });
        elementos1.forEach((elemento) => {
            elemento.style.backgroundColor = '#fff7f0';
        });
    }
};
