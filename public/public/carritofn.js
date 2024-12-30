 
 function carritoSelect(){
    const url = 'http://127.0.0.1:3000/carrito';  // Cambia la URL dependiendo de la acción
    const method = 'GET';
    fetch(url, {
        method: method,
        headers:  {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObj)  // Convierte el objeto a JSON
    })
    .then(response => response.json())
    .then(data => {
    console.log('Respuesta del servidor:', data);
    if (data.success) { //PREGUNTAR 
        if (!isLogin) {
            alert('Usuario Registrado');
            //setTimeout(() => {
             ///   window.location.href = 'http://127.0.0.1:5500/index.html';
           // }, 500); // Espera 500ms antes de redirigir     
                // Limpiar sessionStorage después del envío
            sessionStorage.removeItem("formData");
            form.reset(); // Limpia el formulario
            
        } else {
            const username = form.elements['username'].value;
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('username', username);
                 // Limpiar sessionStorage después del envío  
            window.location.href = 'http://127.0.0.1:3000/index.html';
            
          
        }
    } else {
        alert('El registro o inicio de sesión falló. ' + (data.message || 'Error desconocido.'));
    }
    });
 }


 function carritoUpdate(){
    const username = localStorage.getItem('username'); // Asume que el username está en localStorage
    
    const url = 'http://127.0.0.1:3000/carroup';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username}),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert('OKEY');
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Ocurrió un error al añadir al carrito');
        });

 }
 function carritoInsert(button){
    const productCard = button.closest('.product');
    const username = localStorage.getItem('username'); // Asume que el username está en localStorage
    const nombre_producto = productCard.querySelector('.card-title').textContent.trim(); // Obtiene el texto del producto
    const cantidad = parseInt(productCard.querySelector('.quantity').value, 10);
    const valor_unitario = parseFloat(productCard.querySelector('.card-price').textContent.replace('$', ''));

    const url = 'http://127.0.0.1:3000/carro';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, nombre_producto, cantidad, valor_unitario }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert('Producto añadido al carrito');
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Ocurrió un error al añadir al carrito');
        });

 }
