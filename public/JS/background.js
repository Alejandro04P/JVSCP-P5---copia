function cambiarPatron() {
    const elementos1 = document.querySelectorAll('.product-item1'); // Seleccionar todos los elementos con la clase 'datos'
    const elementos = document.querySelectorAll('.product-item'); // Seleccionar todos los elementos con la clase 'product-item'
    
    if (localStorage.getItem('fondo') === 'imagenes/back.jpg') {
        // Cambiar el fondo del body
        document.body.style.backgroundImage = "url('imagenes/patron.png')";
        localStorage.setItem('fondo', 'imagenes/patron.png'); // Guardar preferencia

        // Cambiar el color de fondo de los elementos con clase 'datos
        // Cambiar el color de fondo de los elementos con clase 'product-item'
        elementos.forEach((elemento) => {
            elemento.style.backgroundColor = '#fff7f0'; // Otro color para 'product-item'
            
        });
      
        elementos1.forEach((elemento) => {
            elemento.style.backgroundColor = '#e7c8a3'; // Color claro para el fondo
        });
       ;
      
    } else {
        // Cambiar el fondo del body
        document.body.style.backgroundImage = "url('imagenes/back.jpg')";
        localStorage.setItem('fondo', 'imagenes/back.jpg'); // Guardar preferencia

        // Cambiar el color de fondo de los elementos con clase 'datos'
      

        // Cambiar el color de fondo de los elementos con clase 'product-item'
        elementos.forEach((elemento) => {
            elemento.style.backgroundColor = '#e7c8a3'; // Otro color para 'product-item'
        });
        elementos1.forEach((elemento) => {
            elemento.style.backgroundColor = '#fff7f0'; // Color oscuro para el fondo
        });
    }
}

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
