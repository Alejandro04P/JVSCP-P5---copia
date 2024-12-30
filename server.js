const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = 3000;
const { QueryTypes, Sequelize } = require('sequelize');
const { verifyConection, sequelize: dbA,  } = require('./conexion')


// Middleware para servir archivos estáticos y parsear JSON
app.use(cors());
// Habilitar CORS
app.use(express.static('public')); // Servir archivos estáticos 
app.use(bodyParser.json());  // Parsear JSON en el cuerpo de la solicitud
app.listen(process.env.API_HOST_URL, () => {
    console.log(`servidor levantado ${process.env.API_HOST_URL}`);
});


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
    const { username, nombre_producto, cantidad, valor_unitario } = req.body;

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
            'SELECT id_producto FROM productos WHERE pro_descripcion = :nombre_producto',
            {
                type: QueryTypes.SELECT,
                replacements: { nombre_producto }
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
                (id_usuario, id_producto, cantidad, valor_unitario, estado_carrito, fecha_agregado)
                VALUES (:id_usuario, :id_producto, :cantidad, :valor_unitario, 'ACT', NOW())`,
                {
                    type: QueryTypes.INSERT,
                    replacements: {
                        id_usuario,
                        id_producto,
                        cantidad,
                        valor_unitario
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
    const { username, cantidad } = req.body;

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

        // Verificar si el producto ya existe en el carrito del usuario
        const carritoItem = await dbA.query(
            `SELECT * FROM carrito 
            WHERE id_usuario = :id_usuario AND id_producto = :id_producto`,
            {
                type: QueryTypes.SELECT,
                replacements: { id_usuario, id_producto }
            }
        );

        if (!carritoItem.length) {
            return res.status(404).json({ success: false, message: 'El producto no existe en el carrito' });
        }

        // Actualizar la cantidad del producto en el carrito
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

        res.status(200).json({ success: true, message: 'Cantidad actualizada en el carrito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al actualizar el carrito' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
// Inicializar el servidor

