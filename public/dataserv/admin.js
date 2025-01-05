document.addEventListener('DOMContentLoaded', () => {
    const options = document.querySelectorAll('.crud-option');
    const contentTitle = document.getElementById('crud-content-title');
    const formContainer = document.getElementById('form-container');

    const forms = {
        insert: `
            <form>
                <h3>Insertar Registro</h3>
                <label for="campo1">Campo 1:</label>
                <input type="text" id="campo1" class="crud-input">
                <label for="campo2">Campo 2:</label>
                <input type="text" id="campo2" class="crud-input">
                <button type="button" class="crud-button">Guardar</button>
            </form>
        `,
        update: `
            <form>
                <h3>Actualizar Registro</h3>
                <label for="idRegistro">ID del Registro:</label>
                <input type="text" id="idRegistro" class="crud-input">
                <label for="nuevoValor">Nuevo Valor:</label>
                <input type="text" id="nuevoValor" class="crud-input">
                <button type="button" class="crud-button">Actualizar</button>
            </form>
        `,
        delete: `
            <form>
                <h3>Eliminar Registro</h3>
                <label for="idEliminar">ID del Registro:</label>
                <input type="text" id="idEliminar" class="crud-input">
                <button type="button" class="crud-button">Eliminar</button>
            </form>
        `,
        select: `
            <form>
                <h3>Consultar Registros</h3>
                <label for="filtro">Filtro:</label>
                <input type="text" id="filtro" class="crud-input">
                <button type="button" class="crud-button">Consultar</button>
            </form>
        `,
    };

    options.forEach(option => {
        option.addEventListener('click', () => {
            const action = option.dataset.action;
            contentTitle.textContent = `${action.charAt(0).toUpperCase() + action.slice(1)} Registro`;
            formContainer.innerHTML = forms[action];
        });
    });
});