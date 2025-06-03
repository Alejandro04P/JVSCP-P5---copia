const API_PAGO = "/api/gestion/facturas/transacciones";
function crearFactura(){
     var subtotalSpan = document.querySelector('#subtotal');
     subtotalSpan = subtotalSpan.querySelector('.total-price');
     if (subtotalSpan) {
          const subtotalText = subtotalSpan.textContent; // Obtiene "$0.00"
          // Elimina el "$" y convierte a número
          const subtotalValue = parseFloat(subtotalText.replace('$', ''));
          var username = localStorage.getItem("username");

          if (username) {
               var facturajson= {
                    username: username,
                    mont:subtotalValue
               }
               console.log(facturajson);
          $.ajax({
               url: API_PAGO, // Asegúrate de que API_CARRITO apunta al endpoint correcto
               method: 'POST',
               contentType: 'application/json',
               data: JSON.stringify(facturajson),
               success: function(response) {
                    if (response && response.Message === "OK") {
                         console.log("Hola");
                    Swal.fire({
                              icon: 'success',
                              title: '¡Compra Exitosa!'
                        }).then((result) => { // <-- AGREGADO: .then() para manejar la promesa de SweetAlert2
                            // Esta función se ejecuta cuando el modal se cierra
                            // 'result' contiene información sobre cómo se cerró el modal
                            if (result.isConfirmed || result.isDismissed) { // Si el usuario hizo clic en OK o en el fondo
                                window.location.href = '/index.html'; // Redirige al index
                         }
                    });
                    } else {
                         Swal.fire({
                              icon: 'error',
                              title: 'Error',
                              text: response.message || 'Hubo un error en la operación del carrito.'
                         });
                    }
               },
               error: function(xhr, status, error) {
                    console.error('Error al añadir al carrito:', xhr.responseText);
                    let errorMessage = 'Hubo un error al añadir el producto al carrito.';
                    try {
                         const errorResponse = JSON.parse(xhr.responseText);
                         if (errorResponse && errorResponse.message) {
                              errorMessage = errorResponse.message;
                         }
                    } catch (e) {
                         // Si responseText no es JSON válido, usar el mensaje genérico
                    }
                    Swal.fire({
                         icon: 'error',
                         title: 'Error',
                         text: errorMessage
                    });
               }
          });
          // Llama a la función que maneja el envío al backend
          } else {
        // Si el userId NO está en localStorage, haz la llamada GET al backend para obtenerlo
               console.log("UserID no encontrado en localStorage. Obteniendo del backend..."); 
          }
     }
}