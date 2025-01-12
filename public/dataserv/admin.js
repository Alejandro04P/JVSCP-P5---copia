
document.addEventListener('DOMContentLoaded', () => {
    const options = document.querySelectorAll('.crud-option');
    const contentTitle = document.getElementById('crud-content-title');
    const formContainer = document.getElementById('form-container');
    const tableSelector = document.getElementById('table-select');

    const forms = {
        carrito: {
            select: `
                <form>
                    <h3>Filtrar Registros del Carrito</h3>
                    <label for="filtroUsuario">Usuario:</label>
                    <select id="usuario" class="crud-input">
                        <!-- Opciones dinámicas cargadas con nombres de usuarios -->
                    </select>
                    <label for="filtroProducto">Producto:</label>
                    <select id="producto"" class="crud-input">
                        <!-- Opciones dinámicas cargadas con nombres de productos -->
                    </select>
                    <button type="submit" class="crud-button">Consultar</button>
                </form>
            `,
        },
        factura: {
            select: `
               <form>
                    <h3>Filtrar Registros de las Facturas</h3>
                    <label for="filtroUsuario">Usuario:</label>
                    <select id="usuario" class="crud-input">
                        <!-- Opciones dinámicas cargadas con nombres de usuarios -->
                    </select>
                    <label for="idFacturas">Facturas:</label>
                    <select id="facturas"" class="crud-input">
                        <!-- Opciones dinámicas cargadas con nombres de productos -->
                    </select>
                    <label for="filtroFecha">Fecha:</label>
                    <input type="date" id="filtroFecha" class="crud-input">
                    <label for="filtroEstado">Estado:</label>
                    <select id="filtroEstado" class="crud-input">
                        <option value="factura" selected>Todos</option>
                        <option value="activa">Activa</option>
                        <option value="inactiva">Inactiva</option>
                        <option value="pendiente">Pendiente</option>               
                    </select>
                    <label for="actualizarEstado">¿Desea actualizar el estado?</label>
                    <select id="actualizarEstado" class="crud-input" onchange="mostrarCampoActualizarEstado()">
                        <option value="no">No</option>
                        <option value="si">Sí</option>
                    </select>
                    <div id="nuevoEstadoDiv" style="display: none; align-items: center; gap: 10px;">
                        <label for="nuevoEstado">Nuevo Estado:</label>
                        <select id="nuevoEstado" class="crud-input">
                            <option value="activa">Activa</option>
                            <option value="inactiva">Inactiva</option>
                            <option value="pendiente">Pendiente</option>
                        </select>
                        <button id="btnActualizar" type="button" class="crud-button" onclick="actualizarEstadoFac('#nuevoEstado','#facturas','#usuario')">Actualizar</button>
                    </div>
                    <button type="submit" class="crud-button">Consultar</button>
                </form>
            `,
        },
        detalleFactura: {
            select: `
                <form>
                    <h3>Filtrar Registros en Detalles de Factura</h3>
                    <label for="idFacturaFiltro">ID de la Factura:</label>
                    <select id="idFacturaFiltro" class="crud-input">
                        <!-- Opciones dinámicas cargadas con IDs de facturas -->
                    </select>
                    <label for="productoFiltro">Producto:</label>
                    <select id="producto"" class="crud-input">
                        <!-- Opciones dinámicas cargadas con nombres de productos -->
                    </select>
                    <button type="submit" class="crud-button">Consultar</button>
                </form>
            `,
        },
    };

    options.forEach(option => {
        option.addEventListener('click', () => {
            const action = option.dataset.action;
            const selectedTable = tableSelector.value;
            contentTitle.textContent = `Registros en ${selectedTable}`;
            formContainer.innerHTML = forms[selectedTable][action];
            const form = formContainer.querySelector('form');
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                handleAction(selectedTable, action, new FormData(form));
            });
        
            if (action === 'select') {
                if (selectedTable === 'carrito') {
                    loadUsuarios('#usuario',selectedTable);
            
                } else if (selectedTable === 'factura') {
                    loadUsuarios('#usuario',selectedTable);
                }else {
                    loadFacturas('#idFacturaFiltro');
                    //loadProductos('#producto');
                }
            }
        });
    });

    function handleAction(table, action, form) {
        if (action !== 'select') {
            alert('Solo se permiten consultas.');
            return;
        }

        const formDataObject = {};
    
        // Recorrer los pares clave-valor de FormData
        for (const [key, value] of formData.entries()) {
            formDataObject[key] = value;
        }
    
        // Mostrar las claves y valores en un alert
        let alertMessage = "Datos del Formulario:\n";
        for (const [key, value] of Object.entries(formDataObject)) {
            alertMessage += `${key}: ${value}\n`;
        }
        alert(alertMessage);
    
        // Construir los parámetros de consulta a partir de formDataObject
        const queryParams = new URLSearchParams(formDataObject).toString();
    
        const url = `https://nodejs-production-0097.up.railway.app/${table}/select?${queryParams}`;
    
        // Mostrar la URL generada para depuración
        alert(`URL Generada:\n${url}`);
    
        // Realizar la solicitud GET
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                // Actualizar la tabla de resultados
                actualizarTablaResultados(data);
            })
            .catch((error) => {
                console.error('Error al realizar la consulta:', error);
                alert('Hubo un error al realizar la consulta.');
            });
    }
    

// 2. Función para actualizar la tabla de resultados dinámicamente
function actualizarTablaResultados(data) {
    const tabla = document.querySelector('#tabla-resultados');
    const encabezado = document.querySelector('#tabla-encabezado');
    const cuerpo = document.querySelector('#tabla-cuerpo');

    // Limpiar la tabla
    encabezado.innerHTML = '';
    cuerpo.innerHTML = '';

    if (data.length > 0) {
        // Mostrar la tabla
        tabla.style.display = 'table';

        // Generar encabezados dinámicos
        const keys = Object.keys(data[0]);
        keys.forEach(key => {
            const th = document.createElement('th');
            th.textContent = key;
            encabezado.appendChild(th);
        });

        // Generar filas dinámicas
        data.forEach(row => {
            const tr = document.createElement('tr');
            keys.forEach(key => {
                const td = document.createElement('td');
                td.textContent = row[key];
                tr.appendChild(td);
            });
            cuerpo.appendChild(tr);
        });
    } else {
        // Ocultar la tabla si no hay resultados
        tabla.style.display = 'none';
        alert('No se encontraron resultados.');
    }
}


    function loadUsuarios(selector,tabla) {
        fetch('https://nodejs-production-0097.up.railway.app/usuarios')
            .then(response => response.json())
            .then(data => {
                const select = document.querySelector(selector);
                if (select) {
                    select.innerHTML = `<option value = "usuarioc" selected>Todos</option>` + data.map(usuario => `<option value="${usuario.id_usuario}">${usuario.username}</option>`).join('');
                }
                if(tabla === 'carrito'){
                    select.addEventListener('change', (event) => {
                        const usuarioSeleccionado = event.target.value;
                        loadProductosPorUsuario('#producto', usuarioSeleccionado);
                               
                    });
                }else{
                    select.addEventListener('change', (event) => {
                        const usuarioSeleccionado = event.target.value;
                        loadClientesFacturas('#facturas',usuarioSeleccionado);                 
                    });     
                }
               
            })
            .catch(error => console.error('Error al cargar usuarios:', error));
    }

    function loadClientesFacturas(selector,idUsuario){
        const url = idUsuario === 'usuarioc' 
        ? `https://nodejs-production-0097.up.railway.app/facturacli` // Sin query string
        : `https://nodejs-production-0097.up.railway.app/facturacli?usuario=${encodeURIComponent(idUsuario)}`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
            .then(data => {
                const select = document.querySelector(selector);
                if (select) {
                    select.innerHTML = `<option value = "clifac" selected>Todos</option>` +
                        data.map(facturas => `<option value="${facturas.id_factura}">${facturas.id_factura}</option>`).join('');
                }

                select.addEventListener('change', (event) => {
                    const facturaSeleccionada = event.target.value;
                    if (facturaSeleccionada === 'clifac') {
                        restaurarEstadoEstatico('#filtroEstado'); // Restaurar opciones estáticas
                    } else {
                        cargarEstadosPorFactura('#filtroEstado', facturaSeleccionada); // Cargar estados dinámicos
                    }
                });
            })
        .catch(error => console.error('Error al cargar factura:', error));
      
    }
    function loadProductosPorUsuario(selector, idUsuario) {
        const url = idUsuario === 'usuarioc' 
        ? `https://nodejs-production-0097.up.railway.app/productos` // Sin query string
        : `https://nodejs-production-0097.up.railway.app/productos?usuario=${encodeURIComponent(idUsuario)}`;
      
     
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
            .then(data => {
                const select = document.querySelector(selector);
                if (select) {
                    select.innerHTML =   `<option value = "userpro" selected>Todos</option>` +
                        data.map(producto => `<option value="${producto.id_producto}">${producto.pro_descripcion}</option>`).join('');
                }
            })
            .catch(error => console.error('Error al cargar productos:', error));
    }

    function loadFacturas(selector,tabla) {
        fetch('https://nodejs-production-0097.up.railway.app/facturas')
            .then(response => response.json())
            .then(data => {
                const select = document.querySelector(selector);
                if (select) {
                    select.innerHTML = `<option value="dfactura" selected>Todos</option>` + data.map(factura => `<option value="${factura.id_factura}">${factura.id_factura}</option>`).join('');
                }
                    select.addEventListener('change', (event) => {
                        const facturaseleccion = event.target.value;
                        loadProductosPorFactura('#producto', facturaseleccion);
                            //loadProductosPorClientesConFacturas('#producto'); 
                    });
            })
            .catch(error => console.error('Error al cargar usuarios:', error));
    }
    
    function loadProductosPorFactura(selector, idFactura) {
        const url = idFactura === 'dfactura' 
        ? `https://nodejs-production-0097.up.railway.app/productos/fac` // Sin query string
        : `https://nodejs-production-0097.up.railway.app/productos/fac?factura=${encodeURIComponent(idFactura)}`;
      
     
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
            .then(data => {
                const select = document.querySelector(selector);
                if (select) {
                    select.innerHTML = 
                        data.map(producto => `<option value="${producto.id_producto}">${producto.pro_descripcion}</option>`).join('');
                }
            })
            .catch(error => console.error('Error al cargar productos:', error));
    }

/*    function handleAction(table, action, formData) {
        let url = `https://nodejs-production-0097.up.railway.app/${table}`;
        let method = 'POST'; // Default to POST for inserts

        if (action === 'update') {
            url += `/update`;
            method = 'PUT';
        } else if (action === 'delete') {
            url += `/delete`;
            method = 'DELETE';
        } else if (action === 'select') {
            url += `/select`;
            method = 'GET';
        }

        const data = Object.fromEntries(formData.entries());

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(result => {
                console.log('Resultado:', result);
                alert(`Acción ${action} realizada con éxito`);
            })
            .catch(error => {
                console.error('Error al realizar la acción:', error);
                alert('Hubo un error al realizar la acción');
            });
    }
*/

function mostrarCampoActualizarEstado() {
    const actualizarEstado = document.getElementById('actualizarEstado').value;
    const nuevoEstadoDiv = document.getElementById('nuevoEstadoDiv');
    if (actualizarEstado === 'si') {
        nuevoEstadoDiv.style.display = 'flex'; // Mostrar el div con "flex"
    } else {
        nuevoEstadoDiv.style.display = 'none'; // Ocultar el div
    }
}
}); 

/*
function handleAction(table, action, formData) {
    if (action !== 'select') {
        alert('Solo se permiten consultas.');
        return;
    }

    // Construir la URL con parámetros de consulta
    const queryParams = new URLSearchParams(formData).toString();
    const url = `https://nodejs-production-0097.up.railway.app/${table}/select?${queryParams}`;

    // Realizar la solicitud GET
    fetch(url{
        method: GET
    })
        
        .then(response => response.json())
        .then(result => {
            console.log('Resultados:', result);
            alert('Consulta realizada con éxito');
        })
        .catch(error => {
            console.error('Error al realizar la consulta:', error);
            alert('Hubo un error al realizar la consulta');
        });
}*/
    function actualizarEstadoFac(selecest, selectfac,selectuser) {
        const url = `https://nodejs-production-0097.up.railway.app/estadofac`;

        // Obtén los elementos select
        const selectU = document.querySelector(selectuser);
        const selectF = document.querySelector(selectfac);
        const selectE = document.querySelector(selecest);


        if (!selectU || !selectF) {
            console.error('No se encontraron los elementos select.');
            return;
        }

        //Obtener el texto del <option> seleccionado (si es necesario)
        const usuarioTexto = selectU.options[selectU.selectedIndex].text;
        const facturaTexto = selectF.options[selectF.selectedIndex].text;
        const estadoTexto = selectE.options[selectE.selectedIndex].text;

        // Enviar datos al servidor
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario: usuarioTexto,
                factura: facturaTexto,
                estado: estadoTexto,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
            })
            .catch((error) => {
                console.error('Error al actualizar:', error);
                alert('Ocurrió un error al actualizar la factura.');
            });
    }

    function mostrarCampoActualizarEstado() {
        const actualizarEstado = document.getElementById('actualizarEstado').value;
        const nuevoEstadoDiv = document.getElementById('nuevoEstadoDiv');
        if (actualizarEstado === 'si') {
            nuevoEstadoDiv.style.display = 'flex'; // Mostrar el div con "flex"
        } else {
            nuevoEstadoDiv.style.display = 'none'; // Ocultar el div
        }
    }

    function restaurarEstadoEstatico(selector) {
        const selectEstado = document.querySelector(selector);
        if (selectEstado) {
            selectEstado.disabled = false;
            selectEstado.innerHTML = `
                <option value="factura" selected>Todos</option>
                <option value="activa">Activa</option>
                <option value="inactiva">Inactiva</option>
                <option value="pendiente">Pendiente</option>`;
        }
    }
    
    function cargarEstadosPorFactura(selector, idFactura) {
        const url = `https://nodejs-production-0097.up.railway.app/estados/factura?factura=${encodeURIComponent(idFactura)}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const selectEstado = document.querySelector(selector);
                if (selectEstado) {
                    selectEstado.disabled = false;
                    selectEstado.innerHTML = data.map(estado => `<option value="${estado.estado_fac}">${estado.estado_fac}</option>`).join('');
                }
            })
            .catch(error => console.error('Error al cargar estados por factura:', error));
    }


