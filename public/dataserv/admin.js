/* data MIRAAAAAA
document.addEventListener('DOMContentLoaded', () => {
    const options = document.querySelectorAll('.crud-option');
    const contentTitle = document.getElementById('crud-content-title');
    const formContainer = document.getElementById('form-container');
    const tableSelector = document.getElementById('table-select');

    const forms = {
        carrito: {
            insert: `
                <form>
                    <h3>Insertar Registro en Carrito</h3>
                    <label for="usuario">Usuario:</label>
                    <select id="usuario" class="crud-input">
                        <!-- Opciones dinámicas cargadas con nombres de usuarios -->
                    </select>
                    <label for="producto">Producto:</label>
                    <select id="producto" class="crud-input">
                        <!-- Opciones dinámicas cargadas con nombres de productos -->
                    </select>
                    <label for="cantidad">Cantidad:</label>
                    <input type="number" id="cantidad" class="crud-input" min="1">
                    <label for="estado">Estado:</label>
                    <input type="text" id="estado" class="crud-input">
                    <button type="submit" class="crud-button">Guardar</button>
                </form>
            `,
            update: `
                <form>
                    <h3>Actualizar Cantidad en Carrito</h3>
                    <label for="idCarrito">ID del Carrito:</label>
                    <input type="text" id="idCarrito" class="crud-input">
                    <label for="nuevaCantidad">Nueva Cantidad:</label>
                    <input type="number" id="nuevaCantidad" class="crud-input" min="1">
                    <button type="submit" class="crud-button">Actualizar</button>
                </form>
            `,
            delete: `
                <form>
                    <h3>Eliminar Registro del Carrito</h3>
                    <label for="idEliminar">ID del Carrito:</label>
                    <input type="text" id="idEliminar" class="crud-input">
                    <button type="submit" class="crud-button">Eliminar</button>
                </form>
            `,
            select: `
                <form>
                    <h3>Consultar Registros del Carrito</h3>
                    <label for="filtroUsuario">Usuario:</label>
                    <select id="usuario" class="crud-input">
                        <!-- Opciones dinámicas cargadas con nombres de usuarios -->
                    </select>
                    <label for="filtroProducto">Producto:</label>
                    <select id="producto" class="crud-input">
                        <!-- Opciones dinámicas cargadas con nombres de productos -->
                    </select>
                    <button type="submit" class="crud-button">Consultar</button>
                </form>
            `,
        },
        factura: {
            insert: `
                <form>
                    <h3>Insertar Factura</h3>
                    <label for="usuario">Usuario:</label>
                    <select id="usuario" class="crud-input">
                        <!-- Opciones dinámicas cargadas con nombres de usuarios -->
                    </select>
                    <label for="descripcion">Descripción:</label>
                    <input type="text" id="descripcion" class="crud-input">
                    <label for="subtotal">Subtotal:</label>
                    <input type="number" id="subtotal" class="crud-input" min="0">
                    <label for="iva">IVA:</label>
                    <input type="number" id="iva" class="crud-input" min="0">
                    <label for="total">Total:</label>
                    <input type="number" id="total" class="crud-input" min="0">
                    <button type="submit" class="crud-button">Guardar</button>
                </form>
            `,
            update: `
                <form>
                    <h3>Actualizar Factura</h3>
                    <label for="idFactura">ID de la Factura:</label>
                    <input type="text" id="idFactura" class="crud-input">
                    <label for="descripcion">Nueva Descripción:</label>
                    <input type="text" id="descripcion" class="crud-input">
                    <button type="submit" class="crud-button">Actualizar</button>
                </form>
            `,
            delete: `
                <form>
                    <h3>Eliminar Factura</h3>
                    <label for="idFacturaEliminar">ID de la Factura:</label>
                    <input type="text" id="idFacturaEliminar" class="crud-input">
                    <button type="submit" class="crud-button">Eliminar</button>
                </form>
            `,
            select: `
                <form>
                    <h3>Consultar Facturas</h3>
                    <label for="filtroUsuario">Usuario:</label>
                    <select id="usuario" class="crud-input">
                        <!-- Opciones dinámicas cargadas con nombres de usuarios -->
                    </select>
                    <label for="filtroFecha">Fecha:</label>
                    <input type="date" id="filtroFecha" class="crud-input">
                    <button type="submit" class="crud-button">Consultar</button>
                </form>
            `,
        },
        detalleFactura: {
            insert: `
                <form>
                    <h3>Insertar Detalle de Factura</h3>
                    <label for="idFactura">ID del Usuario:</label>
                    <select id="usuario" class="crud-input">
                        <!-- Opciones dinámicas cargadas con usuarios de la base de datos -->
                    </select>
                    <label for="producto">Producto:</label>
                    <select id="producto" class="crud-input">
                        <!-- Opciones dinámicas cargadas con nombres de productos -->
                    </select>
                    <label for="cantidad">Cantidad:</label>
                    <input type="number" id="cantidad" class="crud-input" min="1">
                    <label for="valor">Valor:</label>
                    <input type="number" id="valor" class="crud-input" min="0">
                    <button type="submit" class="crud-button">Guardar</button>
                </form>
            `,
            update: `
                <form>
                    <h3>Actualizar Detalle de Factura</h3>
                    <label for="idFactura">ID de la Factura:</label>
                    <input type="text" id="idFactura" class="crud-input">
                    <label for="producto">Producto:</label>
                    <input type="text" id="producto" class="crud-input">
                    <label for="nuevaCantidad">Nueva Cantidad:</label>
                    <input type="number" id="nuevaCantidad" class="crud-input" min="1">
                    <button type="submit" class="crud-button">Actualizar</button>
                </form>
            `,
            delete: `
                <form>
                    <h3>Eliminar Detalle de Factura</h3>
                    <label for="idFacturaEliminar">ID de la Factura:</label>
                    <input type="text" id="idFacturaEliminar" class="crud-input">
                    <label for="productoEliminar">Producto:</label>
                    <input type="text" id="productoEliminar" class="crud-input">
                    <button type="submit" class="crud-button">Eliminar</button>
                </form>
            `,
            select: `
                <form>
                    <h3>Consultar Detalles de Factura</h3>
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
            contentTitle.textContent = `${action.charAt(0).toUpperCase() + action.slice(1)} Registro en ${selectedTable}`;
            formContainer.innerHTML = forms[selectedTable][action];
            const form = formContainer.querySelector('form');
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                handleAction(selectedTable, action, new FormData(form));
            });


            if (action === 'insert' || action === 'select') {
                if (selectedTable === 'carrito' || selectedTable === 'detalleFactura') {
                    loadUsuarios('#usuario');
                    loadProductos('#producto');
                    loadFacturas('#idFacturaFiltro');
                } else if (selectedTable === 'factura') {
                    loadUsuarios('#usuario');
                }
            }
        });
    });
    function loadUsuarios(selector) {
        fetch('https://nodejs-production-0097.up.railway.app/usuarios')
            .then(response => response.json())
            .then(data => {
                const select = document.querySelector(selector);
                if (select) {
                    select.innerHTML = data.map(usuario => `<option value="${usuario.id_usuario}">${usuario.username}</option>`).join('');
                }
            })
            .catch(error => console.error('Error al cargar usuarios:', error));
    }
    
    function loadProductos(selector) {
        fetch('https://nodejs-production-0097.up.railway.app/productos')
            .then(response => response.json())
            .then(data => {
                const select = document.querySelector(selector);
                if (select) {
                    select.innerHTML = data.map(producto => 
                        `<option value="${producto.id_producto}">(${producto.id_producto}) ${producto.pro_descripcion}-(${producto.pro_relleno})</option>`
                    ).join('');
                }
            })
            .catch(error => console.error('Error al cargar productos:', error));
    }

    function loadFacturas(selector) {
        fetch('https://nodejs-production-0097.up.railway.app/facturas')
            .then(response => response.json())
            .then(data => {
                const select = document.querySelector(selector);
                if (select) {
                    select.innerHTML = data.map(factura => `<option value="${factura.id_factura}">${factura.id_factura}</option>`).join('');
                }
            })
            .catch(error => console.error('Error al cargar facturas:', error));
    }

    function handleAction(table, action, formData) {
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

});
*/
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
                    <div id="nuevoEstadoDiv" style="display: none;">
                        <label for="nuevoEstado">Nuevo Estado:</label>
                        <select id="nuevoEstado" class="crud-input">
                            <option value="activa">Activa</option>
                            <option value="inactiva">Inactiva</option>
                            <option value="pendiente">Pendiente</option>
                        </select>
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


            if (action === 'insert' || action === 'select') {
                if (selectedTable === 'carrito' || selectedTable === 'detalleFactura') {
                    loadUsuarios('#usuario');
                    loadProductos('#producto');
                    loadFacturas('#idFacturaFiltro');
                } else if (selectedTable === 'factura') {
                    loadUsuarios('#usuario');
                }
            }
        });
    });

    function loadUsuarios(selector) {
        fetch('https://nodejs-production-0097.up.railway.app/usuarios')
            .then(response => response.json())
            .then(data => {
                const select = document.querySelector(selector);
                if (select) {
                    select.innerHTML = `<option value = "usuarioc" selected>Todos</option>` + data.map(usuario => `<option value="${usuario.id_usuario}">${usuario.username}</option>`).join('');
                }
            })
            .catch(error => console.error('Error al cargar usuarios:', error));
    }
    
    function loadProductos(selector) {
        fetch('https://nodejs-production-0097.up.railway.app/productos')
            .then(response => response.json())
            .then(data => {
                const select = document.querySelector(selector);
                if (select) {
                    select.innerHTML = data.map(producto => 
                        `<option value="${producto.id_producto}">(${producto.id_producto}) ${producto.pro_descripcion}-(${producto.pro_relleno})</option>`
                    ).join('');
                }
            })
            .catch(error => console.error('Error al cargar productos:', error));
    }

    function loadFacturas(selector) {
        fetch('https://nodejs-production-0097.up.railway.app/facturas')
            .then(response => response.json())
            .then(data => {
                const select = document.querySelector(selector);
                if (select) {
                    select.innerHTML = `<option value="dfactura" selected>Todos</option>` + data.map(factura => `<option value="${factura.id_factura}">${factura.id_factura}</option>`).join('');
                }
            })
            .catch(error => console.error('Error al cargar facturas:', error));
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
}); 
function handleAction(table, action, formData) {
    if (action !== 'select') {
        alert('Solo se permiten consultas.');
        return;
    }

    // Construir la URL con parámetros de consulta
    const queryParams = new URLSearchParams(formData).toString();
    const url = `https://nodejs-production-0097.up.railway.app/${table}/select?${queryParams}`;

    // Realizar la solicitud GET
    fetch(url)
        .then(response => response.json())
        .then(result => {
            console.log('Resultados:', result);
            alert('Consulta realizada con éxito');
        })
        .catch(error => {
            console.error('Error al realizar la consulta:', error);
            alert('Hubo un error al realizar la consulta');
        });
}

function mostrarCampoActualizarEstado() {
    const actualizarEstado = document.getElementById('actualizarEstado').value;
    const nuevoEstadoDiv = document.getElementById('nuevoEstadoDiv');
    if (actualizarEstado === 'si') {
        nuevoEstadoDiv.style.display = 'block';
    } else {
        nuevoEstadoDiv.style.display = 'none';
    }
}

