const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const app = express();
//const PORT = 3000;
const { QueryTypes, Sequelize } = require('sequelize');
const { verifyConection, sequelize: dbA, } = require('./conexion');
// Middleware para servir archivos estáticos y parsear JSON
app.use(cors());
// Habilitar CORS
app.use(express.static('public')); // Servir archivos estáticos 
app.use(bodyParser.json());  // Parsear JSON en el cuerpo de la solicitud
//app.listen(3000, '127.0.0.1', () => {
//    console.log('Servidor escuchando en https://nodejs-production-0097.up.railway.app');
//});
/*const PORT = process.env.PORT || 3000; // Usa el puerto que Railway proporciona o 3000 como predeterminado
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});*/

const PORT = process.env.PORT || 3000; // Usa el puerto asignado por Railway o 3000 como fallback.
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const used = process.memoryUsage();
for (let key in used) {
  console.log(`${key}: ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
}

// Inicializar la base de datos SQLite
/*const db = new sqlite3.Database('./usuarios.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
        db.run(`CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            email TEXT NOT NULL,
            nombre TEXT NOT NULL,
            apellido TEXT NOT NULL,
            fecha_nacimiento DATE NOT NULL,
            telefono TEXT NOT NULL,
            direccion TEXT NOT NULL,
            genero TEXT NOT NULL,
            ocupacion TEXT NOT NULL
        )`);
    }
});*/

// Ruta POST para registrar un nuevo usuario

app.post('/registro', async (req, res) => {
    try {
        await verifyConection();
        const { username, password, email, nombre, apellido, fecha_nacimiento, telefono, direccion, genero, ocupacion } = req.body;
        console.log('Datos recibidos:', { username, password, email, nombre, apellido, fecha_nacimiento, telefono, direccion, genero, ocupacion });
        // Primero, verificar si el nombre de usuario o correo ya existen en la base de datos
        const checkUserSql = 'SELECT * FROM usuarios WHERE username = ? OR email = ?';
        const result = await dbA.query({ query: checkUserSql, values: [username, email] }, { type: QueryTypes.SELECT });
        if (result.length > 0) {
            throw Error('El nombre de usuario o el correo ya están registrados');
        }
        // Si no existe un usuario con ese nombre o correo, continuar con el registro
        const sql = 'INSERT INTO usuarios (username, password, email,nombre,apellido,fecha_nacimiento,telefono,direccion,genero,ocupacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)';
        const data = await dbA.query(sql,{
        type: QueryTypes.INSERT,
        replacements: [username, password, email, nombre, apellido, fecha_nacimiento, telefono, direccion, genero, ocupacion]
        });

        res.status(201).send({ success: true, message: 'Usuario registrado exitosamente', data: data });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: error.message });
    }
});
app.post('/login', async (req, res) => {
    try {
        // Obtener datos del cuerpo de la solicitud
        const { username, password } = req.body;

        // Verificar que ambos campos estén presentes
        if (!username || !password) {
            return res.status(400).send({ message: 'Se requieren el nombre de usuario y la contraseña', success: false });
        }

        // Consulta para verificar si el usuario existe
        const checkUserSql = 'SELECT * FROM usuarios WHERE username = ?';
        const user = await dbA.query(checkUserSql, {
            type: QueryTypes.SELECT,
            replacements: [username]
        });

        // Si no se encuentra el usuario
        if (user.length === 0) {
            return res.status(400).send({ message: 'El usuario no existe', success: false });
        }

        // Verificar contraseña
        const userRecord = user[0]; // El primer registro del resultado
        if (userRecord.password !== password) {
            return res.status(400).send({ message: 'Contraseña incorrecta', success: false });
        }

        // Si la autenticación es exitosa
        res.status(200).send({ message: 'Inicio de sesión exitoso', success: true, user: { username: userRecord.username, email: userRecord.email } });
    } catch (error) {
        // Manejo de errores
        console.error(error);
        return res.status(500).send({ message: 'Error interno del servidor', success: false });
    }
});

app.post('/carro', async (req, res) => {
    const { username, nombre_producto, cantidad, valor_unitario,relleno,image} = req.body;
    console.log('Datos recibidos:', { username,nombre_producto, cantidad, valor_unitario,relleno,image});
    try {
        // Verificar que la conexión a la base de datos esté activa
        await verifyConection();

        // Buscar el ID del usuario usando el username
        const usuario = await dbA.query(
            'SELECT id_usuario FROM usuarios WHERE username = :username',
            {
                type: QueryTypes.SELECT,
                replacements: { username }
            }
        );

        if (!usuario.length) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const id_usuario = usuario[0].id_usuario;

        // Buscar el id_producto
        const producto = await dbA.query(
            'SELECT id_producto FROM productos WHERE pro_descripcion = :nombre_producto AND pro_relleno = :relleno',
            {
                type: QueryTypes.SELECT,
                replacements: { nombre_producto,relleno}
            }
        );

        if (!producto.length) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }

        const id_producto = producto[0].id_producto;

        // Verificar si el producto ya existe en el carrito
        const carritoItem = await dbA.query(
            `SELECT cantidad FROM carrito 
            WHERE id_usuario = :id_usuario AND id_producto = :id_producto`,
            {
                type: QueryTypes.SELECT,
                replacements: { id_usuario, id_producto }
            }
        );

        if (carritoItem.length > 0) {
            // Si el producto ya existe, actualizar la cantidad
            await dbA.query(
                `UPDATE carrito 
                SET cantidad = cantidad + :cantidad, fecha_agregado = NOW()
                WHERE id_usuario = :id_usuario AND id_producto = :id_producto`,
                {
                    type: QueryTypes.UPDATE,
                    replacements: {
                        id_usuario,
                        id_producto,
                        cantidad
                    }
                }
            );
            return res.json({ success: true, message: 'Cantidad actualizada en el carrito' });
        } else {
            // Si el producto no existe, insertarlo
            await dbA.query(
                `INSERT INTO carrito 
                (id_usuario, id_producto, cantidad, valor_unitario, estado_carrito, fecha_agregado,imagen)
                VALUES (:id_usuario, :id_producto, :cantidad, :valor_unitario, 'ACT', NOW(),:image)`,
                {
                    type: QueryTypes.INSERT,
                    replacements: {
                        id_usuario,
                        id_producto,
                        cantidad,
                        valor_unitario,
                        image
                    }
                }
            );
            return res.json({ success: true, message: 'Producto añadido al carrito exitosamente' });
        }
    } catch (error) {
        console.error('Error al procesar el carrito:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

app.post('/carroup', async (req, res) => {
    const { username, cantidad ,nombre_producto,relleno} = req.body;
    try {
        // Verificar que la conexión a la base de datos esté activa
        await verifyConection();

        // Buscar el ID del usuario usando el username
        const usuario = await dbA.query(
            'SELECT id_usuario FROM usuarios WHERE username = :username',
            {
                type: QueryTypes.SELECT,
                replacements: { username }
            }
        );

        if (!usuario.length) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const id_usuario = usuario[0].id_usuario;

        
        // Buscar el id_producto
        const producto = await dbA.query(
            'SELECT id_producto FROM productos WHERE pro_descripcion = :nombre_producto AND pro_relleno = :relleno',
            {
                type: QueryTypes.SELECT,
                replacements: { nombre_producto,relleno}
            }
        );

        if (!producto.length) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }

        const id_productos = producto[0].id_producto;

        // Verificar si el producto ya existe en el carrito del usuario
        const carritoItem = await dbA.query(
            `SELECT * FROM carrito 
            WHERE id_usuario = :id_usuario AND id_producto = :id_productos`,
            {
                type: QueryTypes.SELECT,
                replacements: { id_usuario,id_productos}
            }
        );

        if (!carritoItem.length) {
            return res.status(404).json({ success: false, message: 'El producto no existe en el carrito' });
        }

        // Actualizar la cantidad del producto en el carrito
        await dbA.query(
            `UPDATE carrito 
            SET cantidad = :cantidad, fecha_agregado = NOW()
            WHERE id_usuario = :id_usuario  AND id_producto = :id_productos`,
            {
                type: QueryTypes.UPDATE,
                replacements: {
                    id_usuario,
                    cantidad, id_productos
                }
            }
        );
        res.status(200).json({ success: true, message: 'Cantidad actualizada en el carrito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al actualizar el carrito' });
    }
});

app.get('/carrose', async (req, res) => {
    const { user } = req.query; // Usar req.query para solicitudes GET
    console.log('Datos recibidos:', { user });
    
    try {
        // Verificar la conexión
        await verifyConection();

        // Buscar el usuario en la base de datos
        const usuario = await dbA.query(
            'SELECT id_usuario FROM usuarios WHERE username = :user',
            {
                type: QueryTypes.SELECT,
                replacements: { user }
            }
        );

        if (!usuario.length) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const id_usuario = usuario[0].id_usuario;

        // Consulta con JOIN
        const carrito = await dbA.query(
            `SELECT 
                carrito.id_carrito,
                carrito.id_usuario,
                carrito.id_producto,
                carrito.cantidad,
                carrito.valor_unitario,
                carrito.estado_carrito,
                productos.pro_descripcion,
                productos.pro_precio_venta,
                productos.pro_relleno,
                carrito.imagen
             FROM 
                carrito
             JOIN 
                productos 
             ON 
                carrito.id_producto = productos.id_producto
             WHERE 
                carrito.id_usuario = :id_usuario`,
            {
                type: QueryTypes.SELECT,
                replacements: { id_usuario },
            }
        );
        res.status(200).json({ success: true, carrito }); // Devuelve carrito con éxito
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor', carrito: [] });
    }
});


app.delete('/carrorem', async (req, res) => {
    const { username, nombre_producto, relleno } = req.body;
    console.log('Datos recibidos:', { username ,nombre_producto, relleno });
    try {
        // Verificar la conexión a la base de datos
        await verifyConection();

        // Buscar el ID del usuario
        const usuario = await dbA.query(
            'SELECT id_usuario FROM usuarios WHERE username = :username',
            {
                type: QueryTypes.SELECT,
                replacements: { username },
            }
        );

        if (!usuario.length) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const id_usuario = usuario[0].id_usuario;

        // Buscar el ID del producto con relleno
        const producto = await dbA.query(
            'SELECT id_producto FROM productos WHERE pro_descripcion = :nombre_producto AND pro_relleno = :relleno',
            {
                type: QueryTypes.SELECT,
                replacements: { nombre_producto, relleno },
            }
        );

        if (!producto.length) {
            return res
                .status(404)
                .json({ success: false, message: 'Producto no encontrado en la base de datos' });
        }

        const id_producto = producto[0].id_producto;

        // Eliminar el producto del carrito
        const deleted = await dbA.query(
            'DELETE FROM carrito WHERE id_usuario = :id_usuario AND id_producto = :id_producto',
            {
                type: QueryTypes.DELETE,
                replacements: { id_usuario, id_producto },
            }
        );

        if (deleted) {
            res.status(200).json({ success: true, message: 'Producto eliminado del carrito' });
        } else {
            res.status(400).json({ success: false, message: 'No se pudo eliminar el producto' });
        }
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

app.post('/factura', async (req, res) => {
    const { username, cart } = req.body; // Asegúrate de que el cliente envíe el carrito

    try {
        // Verificar conexión
        await verifyConection();

        // Buscar el id_usuario según el username
        const usuario = await dbA.query(
            'SELECT id_usuario FROM usuarios WHERE username = :username',
            {
                type: QueryTypes.SELECT,
                replacements: { username },
            }
        );

        if (!usuario.length) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const id_usuario = usuario[0].id_usuario;

        // Obtener el último ID de factura y generar uno nuevo
        const lastFactura = await dbA.query(
            'SELECT id_factura FROM facturas ORDER BY id_factura DESC LIMIT 1',
            { type: QueryTypes.SELECT }
        );

        let newIdFactura;
        if (lastFactura.length > 0) {
            // Incrementar el último ID de factura
            const lastId = lastFactura[0].id_factura.trim(); // Ejemplo: 'FAC0001'
            const numericPart = parseInt(lastId.slice(3)) + 1; // Incrementar la parte numérica
            newIdFactura = `FAC${numericPart.toString().padStart(4, '0')}`; // Formatear con ceros a la izquierda
        } else {
            // Si no hay facturas, usar un ID inicial
            newIdFactura = 'FAC0001';
        }

        // Calcular los totales de la factura
        const subtotal = cart.reduce((sum, product) => sum + product.valor_unitario * product.quantity, 0);
        const iva = subtotal * 0.12; // Asume un 12% de IVA
        const total = subtotal + iva;

        // Insertar la factura con el nuevo ID generado
        await dbA.query(
            `INSERT INTO facturas (id_factura, id_usuario, fac_descripcion, fac_fechahora, fac_subtotal, fac_iva, fac_total, estado_fac)
             VALUES (:id_factura, :id_usuario, 'Compra realizada', NOW(), :subtotal, :iva, :total, 'ACT')`,
            {
                type: QueryTypes.INSERT,
                replacements: { id_factura: newIdFactura, id_usuario, subtotal, iva, total },
            }
        );

        res.status(200).json({ success: true, message: 'Factura y detalles insertados con éxito' });
    } catch (error) {
        console.error('Stock insuficiente:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});
app.post('/validarUsuario', async (req, res) => {
    const { username, password } = req.body;
    try {
    
        // Verificar conexión a la base de datos
        await verifyConection();

        // Si el usuario es admin, devolver false directamente
        if (username.toLowerCase() != 'admin') {
            console.log(username);
            return res.status(200).json({ success: false, message: 'Acceso correcto' });
        }else{
            return res.status(200).json({ success: true, message: 'Usuario válido' });
        } 
    } catch (error) {
        console.error('Error al validar usuario:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});
// Ruta para obtener usuarios
app.get('/facturas', async (req, res) => {
    try {
        const facturas = await dbA.query(
            'SELECT id_factura FROM facturas',
            { type: QueryTypes.SELECT }
        );
        res.json(facturas);
    } catch (error) {
        console.error('Error al obtener facturas:', error);
        res.status(500).json({ success: false, message: 'Error al obtener facturas' });
    }
});

app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await dbA.query(
            'SELECT id_usuario, username FROM usuarios',
            { type: QueryTypes.SELECT }
        );
        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
    }
});
app.get('/productos', async (req, res) => {
    const { usuario } = req.query; // Obtén el ID del usuario desde la query string
    console.log('Datos recibidos:', { usuario });
    try {
     // Asegúrate de reemplazSar esto con tu consulta real a la base de datos
     let productos; 
        if(!usuario){
           
            productos = await dbA.query(`
                SELECT DISTINCT c.id_producto, p.pro_descripcion, c.cantidad, c.valor_unitario, p.pro_relleno
                FROM carrito c
                JOIN productos p ON c.id_producto = p.id_producto
            `, {
                replacements: { usuario },
                type: QueryTypes.SELECT
            });
        }else{
            productos = await dbA.query(`
                SELECT DISTINCT c.id_producto, p.pro_descripcion, c.cantidad, c.valor_unitario,p.pro_relleno
                FROM carrito c
                JOIN productos p ON c.id_producto = p.id_producto
                WHERE c.id_usuario = :usuario
            `, {
                replacements: { usuario },
                type: QueryTypes.SELECT
            });
        }
        res.json(productos); // Envía los productos encontrados al cliente
    } catch (error) {
        console.error('Error al obtener productos por usuario:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});
app.get('/productos/fac', async (req, res) => {
    const { factura } = req.query; // Obtén el ID del usuario desde la query string
    console.log('Datos recibidos:', { factura });
    try {
     // Asegúrate de reemplazSar esto con tu consulta real a la base de datos
     let productos; 
        if(!factura){
           
            productos = await dbA.query(`
                SELECT DISTINCT pf.id_producto, p.pro_descripcion, pf.pxf_cantidad, pf.pxf_valor,p.pro_relleno
                FROM proxfac pf
                JOIN productos p ON pf.id_producto = p.id_producto
            `, {
                replacements: { factura },
                type: QueryTypes.SELECT
            });
        }else{
            productos = await dbA.query(`
                SELECT DISTINCT pf.id_producto, p.pro_descripcion, pf.pxf_cantidad, pf.pxf_valor,p.pro_relleno
                FROM proxfac pf
                JOIN productos p ON pf.id_producto = p.id_producto
                WHERE pf.id_factura = :factura
            `, {
                replacements: { factura },
                type: QueryTypes.SELECT
            });
        }
        res.json(productos); // Envía los productos encontrados al cliente
    } catch (error) {
        console.error('Error al obtener productos por usuario:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});
app.get('/facturacli', async (req, res) => {
    const { usuario } = req.query; // Obtén el ID del usuario desde la query string
    const usuarioint = parseInt(usuario,10); // Convierte a número entero
    try {
     // Asegúrate de reemplazSar esto con tu consulta real a la base de datos 
     let facturas; 
        if(!usuario){
            facturas = await dbA.query(`
                SELECT f.id_factura 
                FROM facturas f
            `, {
                replacements: { usuarioint },
                type: QueryTypes.SELECT
            });
        }else{
            facturas = await dbA.query(`
                SELECT DISTINCT f.id_factura
                FROM facturas f
                WHERE f.id_usuario = :usuarioint
            `, {
                replacements: { usuarioint },
                type: QueryTypes.SELECT
            });
        }
        res.json(facturas); // Envía los productos encontrados al cliente
    } catch (error) {
        console.error('Error al obtener factura por usuario:', error);
        res.status(500).json({ error: 'Error al obtener factura' });
    }
});

app.put('/estadofac', async (req, res) => {
    let { usuario, factura,estado } = req.body; // Datos enviados desde el cliente
    
    // Validación de datos
    if (!usuario || !factura) {
        return res.status(400).json({ success: false, message: 'Usuario y factura son requeridos.' });
    }

    try {
        // Lógica de actualización en la base de datos
        if(estado === 'Activa'){
            estado = 'ACT';
        }else if (estado === 'Inactiva'){
            estado = 'INA';
        }else{
             estado = 'PEN';
        }
        const usuario1 = await dbA.query(
            'SELECT id_usuario FROM usuarios WHERE username = :usuario',
            {
                type: QueryTypes.SELECT,
                replacements: { usuario }
            }
        );

        if (!usuario.length) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        factura = factura.trim();
      
        const id_usuario = usuario1[0].id_usuario;
        console.log(factura,id_usuario,estado);
        await dbA.query(
            `
            UPDATE facturas
            SET estado_fac = :estado
            WHERE id_usuario = :id_usuario AND TRIM(id_factura) = :factura
            RETURNING *
            `,
            {
                replacements: { estado,id_usuario, factura},
                type: QueryTypes.UPDATE,
            }
        );
        return res.json({ success: true, message: 'Factura actualizada correctamente' });
        // Verifica si se actualizaron registros
       
    } catch (error) {
        console.error('Error al actualizar factura:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});

app.get('/estados/factura', async (req, res) => {
    const { factura } = req.query; // Obtener la factura desde la query string

    try {
        // Validar que se haya enviado un ID de factura
        if (!factura) {
            return res.status(400).json({ error: 'El ID de la factura es obligatorio.' });
        }

        // Buscar el estado de la factura en la base de datos
        const estadoFactura = await dbA.query(`
            SELECT f.estado_fac
            FROM FACTURAS f
            WHERE f.id_Factura = :factura
        `, {
            replacements: { factura },
            type: QueryTypes.SELECT
        });

        if (!estadoFactura || estadoFactura.length === 0) {
            return res.status(404).json({ error: 'No se encontró la factura especificada.' });
        }
        console.log(estadoFactura,factura);
        res.json(estadoFactura); // Enviar los estados al cliente
    } catch (error) {
        console.error('Error al obtener estados por factura:', error);
        res.status(500).json({ error: 'Ocurrió un error al obtener los estados de la factura.' });
    }
});
// Endpoint genérico para manejar las consultas
app.get('/:table/select', async (req, res) => {
    const { table } = req.params; // Obtener la tabla desde la URL
    let { usuario, facturas, filtroEstado, filtroFecha, producto, idFacturaFiltro} = req.query; // Obtener los parámetros de consulta

    // Limpiar los parámetros de consulta
    usuario = usuario?.trim();
    facturas = facturas?.trim();
    filtroFecha = filtroFecha?.trim();
    filtroEstado = filtroEstado?.trim();
    producto = producto?.trim();
    idFacturaFiltro = idFacturaFiltro?.trim();

    console.log('Datos: ', { usuario, facturas, filtroFecha, filtroEstado, producto, table,idFacturaFiltro });

    // Verificar que la tabla sea válida
    const tablasPermitidas = ['carrito', 'factura', 'detalleFactura'];
    if (!tablasPermitidas.includes(table)) {
        return res.status(400).json({ error: 'Tabla no permitida.' });
    }

    try {
        let query = '';
        const replacements = {};
        let id_usuario = '';
        let id_producto = '';
        // Si se filtra por usuario, obtener el id_usuario
        if (usuario !== 'Todos' && usuario) {
            const usuarioData = await dbA.query(
                'SELECT id_usuario FROM usuarios WHERE username = :usuario',
                {
                    type: QueryTypes.SELECT,
                    replacements: { usuario },
                }
            );

            id_usuario = usuarioData[0]?.id_usuario || '';
        }

        if (producto.includes("Relleno:")) {
            [nombreProducto, rellenoProducto] = producto.split("Relleno:").map(s => s.trim());

            const productoData = await dbA.query(
                `SELECT id_producto 
                 FROM productos 
                 WHERE pro_descripcion LIKE :nombreProducto 
                   AND pro_relleno LIKE :rellenoProducto`,
                {
                    type: QueryTypes.SELECT,
                    replacements: { 
                        nombreProducto: `%${nombreProducto}%`,
                        rellenoProducto: `%${rellenoProducto}%`,
                    },
                }
            );

            id_producto = productoData[0]?.id_producto || '';
        }
        // Construir consultas dinámicas dependiendo de la tabla
        if (table === 'carrito') {
            query = `
                SELECT c.id_carrito, u.username AS usuario, p.pro_descripcion AS producto, c.cantidad, 
                       c.valor_unitario, c.estado_carrito, c.fecha_agregado
                FROM carrito c
                INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
                INNER JOIN productos p ON c.id_producto = p.id_producto
            `;
            if (usuario && id_usuario) {
                query += ' WHERE u.id_usuario = :usuario';
                replacements.usuario = id_usuario;
            }
            if (producto && id_producto) {
                query += id_usuario ? ' AND' : ' WHERE';
                query += ' p.id_producto = :producto';
                replacements.producto = id_producto;
            }
        } else if (table === 'factura') {
            facturas 
            query = `
                SELECT f.id_factura, u.username AS usuario, f.fac_descripcion, 
                       TO_CHAR(f.fac_fechahora, 'YYYY-MM-DD') AS fac_fecha, 
                       f.fac_subtotal, f.fac_iva, f.fac_total, f.estado_fac
                FROM facturas f
                INNER JOIN usuarios u ON f.id_usuario = u.id_usuario
            `;

            const conditions = [];
            if (usuario && id_usuario) {
                conditions.push('u.id_usuario = :usuario');
                replacements.usuario = id_usuario;
            }
            if (facturas && facturas !== 'Todos') {
                conditions.push('TRIM(f.id_factura) = :facturas');
                replacements.facturas = facturas;
            }
            if (filtroFecha) {
                conditions.push("TO_CHAR(f.fac_fechahora, 'YYYY-MM-DD') = :filtroFecha");
                replacements.filtroFecha = filtroFecha;
            }
            if (filtroEstado && filtroEstado !== 'Todos') {
                conditions.push('f.estado_fac = :filtroEstado');
                replacements.filtroEstado = filtroEstado;
            }

            // Añadir las condiciones a la consulta
            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }
        }  else if (table === 'detalleFactura') {
            facturas = idFacturaFiltro;
            query = `
                SELECT pf.id_factura, pf.id_producto, p.pro_descripcion AS producto, 
                       pf.pxf_cantidad, pf.pxf_valor, pf.estado_pxf
                FROM proxfac pf
                INNER JOIN productos p ON pf.id_producto = p.id_producto
                INNER JOIN facturas f ON pf.id_factura = f.id_factura
            `;
            if (facturas && facturas !== 'Todos') {
                query += ' WHERE TRIM(f.id_factura) = :facturas';
                replacements.facturas = facturas;
            }
            if (producto && id_producto) {
                query += facturas ? ' AND' : ' WHERE';
                query += ' p.id_producto = :producto';
                replacements.producto = id_producto;
            }
        }
        // Ejecutar la consulta dinámica
        const resultados = await dbA.query(query, {
            replacements,
            type: QueryTypes.SELECT,
        });

        console.log('Consulta generada:', query); // Log de la consulta generada
        console.log('Reemplazos:', replacements); // Log de los valores de reemplazo
        console.log('Resultados:', resultados); // Log de los resultados
        res.json(resultados); // Enviar los resultados al cliente
    } catch (error) {
        console.error('Error al realizar la consulta:', error);
        res.status(500).json({ error: 'Error al realizar la consulta.' });
    }
});



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Ruta para obtener ID de facturas


// Inicializar el servidor

