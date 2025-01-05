document.addEventListener('DOMContentLoaded', () => {
    const options = document.querySelectorAll('.crud-option');
    const contentTitle = document.getElementById('crud-content-title');
    const formContainer = document.getElementById('form-container');

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
                    <button type="button" class="crud-button">Guardar</button>
                </form>
            `,
            update: `
                <form>
                    <h3>Actualizar Cantidad en Carrito</h3>
                    <label for="idCarrito">ID del Carrito:</label>
                    <input type="text" id="idCarrito" class="crud-input">
                    <label for="nuevaCantidad">Nueva Cantidad:</label>
                    <input type="number" id="nuevaCantidad" class="crud-input" min="1">
                    <button type="button" class="crud-button">Actualizar</button>
                </form>
            `,
            delete: `
                <form>
                    <h3>Eliminar Registro del Carrito</h3>
                    <label for="idEliminar">ID del Carrito:</label>
                    <input type="text" id="idEliminar" class="crud-input">
                    <button type="button" class="crud-button">Eliminar</button>
                </form>
            `,
            select: `
                <form>
                    <h3>Consultar Registros del Carrito</h3>
                    <label for="filtroUsuario">Usuario:</label>
                    <select id="filtroUsuario" class="crud-input">
                        <!-- Opciones dinámicas cargadas con nombres de usuarios -->
                    </select>
                    <label for="filtroProducto">Producto:</label>
                    <select id="filtroProducto" class="crud-input">
                        <!-- Opciones dinámicas cargadas con nombres de productos -->
                    </select>
                    <button type="button" class="crud-button">Consultar</button>
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
                    <button type="button" class="crud-button">Guardar</button>
                </form>
            `,
            update: `
                <form>
                    <h3>Actualizar Factura</h3>
                    <label for="idFactura">ID de la Factura:</label>
                    <input type="text" id="idFactura" class="crud-input">
                    <label for="descripcion">Nueva Descripción:</label>
                    <input type="text" id="descripcion" class="crud-input">
                    <button type="button" class="crud-button">Actualizar</button>
                </form>
            `,
            delete: `
                <form>
                    <h3>Eliminar Factura</h3>
                    <label for="idFacturaEliminar">ID de la Factura:</label>
                    <input type="text" id="idFacturaEliminar" class="crud-input">
                    <button type="button" class="crud-button">Eliminar</button>
                </form>
            `,
            select: `
                <form>
                    <h3>Consultar Facturas</h3>
                    <label for="filtroUsuario">Usuario:</label>
                    <select id="filtroUsuario" class="crud-input">
                        <!-- Opciones dinámicas cargadas con nombres de usuarios -->
                    </select>
                    <label for="filtroFecha">Fecha:</label>
                    <input type="date" id="filtroFecha" class="crud-input">
                    <button type="button" class="crud-button">Consultar</button>
                </form>
            `,
        },
        detalleFactura: {
            insert: `
                <form>
                    <h3>Insertar Detalle de Factura</h3>
                    <label for="idFactura">ID del Usuario:</label>
                    <select id="idUsuario" class="crud-input">
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
                    <button type="button" class="crud-button">Guardar</button>
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
                    <button type="button" class="crud-button">Actualizar</button>
                </form>
            `,
            delete: `
                <form>
                    <h3>Eliminar Detalle de Factura</h3>
                    <label for="idFacturaEliminar">ID de la Factura:</label>
                    <input type="text" id="idFacturaEliminar" class="crud-input">
                    <label for="productoEliminar">Producto:</label>
                    <input type="text" id="productoEliminar" class="crud-input">
                    <button type="button" class="crud-button">Eliminar</button>
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
                    <select id="productoFiltro" class="crud-input">
                        <!-- Opciones dinámicas cargadas con nombres de productos -->
                    </select>
                    <button type="button" class="crud-button">Consultar</button>
                </form>
            `,
        },
    };

    options.forEach(option => {
        option.addEventListener('click', () => {
            const action = option.dataset.action;
            const selectedTable = "detalleFactura";
            contentTitle.textContent = `${action.charAt(0).toUpperCase() + action.slice(1)} Registro en ${selectedTable}`;
            formContainer.innerHTML = forms[selectedTable][action];

            if (action === 'insert' || action === 'select') {
                if (selectedTable === 'detalleFactura') {
                    loadFacturas('#idFacturaFiltro');
                    loadProductos('#productoFiltro');
                }
            }
        });
    });

    function loadFacturas(selector) {
        const facturas = ["F001", "F002", "F003"]; // Simulación
        const select = document.querySelector(selector);
        if (select) {
            select.innerHTML = facturas.map(factura => `<option value="${factura}">${factura}</option>`).join('');
        }
    }

    function loadProductos(selector) {
        const productos = ["Producto A", "Producto B", "Producto C"]; // Simulación
        const select = document.querySelector(selector);
        if (select) {
            select.innerHTML = productos.map(producto => `<option value="${producto}">${producto}</option>`).join('');
        }
    }
});
