import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000; // El proxy y tu frontend se servirán desde este puerto

// Habilitar CORS y parseo JSON para todas las rutas
app.use(cors());
app.use(express.json());

// ✅ ORDEN IMPORTA: Primero las rutas del API proxy
// Proxy para rutas /api/gestion/*
app.use('/api/gestion', async (req, res) => {
    // ✅ CAMBIO CLAVE AQUÍ: La URL de la API real ahora es tiendabackend.runasp.net
    const apiUrl = 'http://tiendabackend.runasp.net/api/gestion' + req.url;
    console.log(`[PROXY] Reenviando: ${req.method} ${req.originalUrl} -> ${apiUrl}`);

    try {
        const response = await fetch(apiUrl, {
            method: req.method,
            headers: {
                // Asegúrate de enviar el Content-Type si hay un body
                'Content-Type': req.headers['content-type'] || 'application/json' 
            },
            body: ['POST', 'PUT', 'PATCH'].includes(req.method)
                ? JSON.stringify(req.body)
                : undefined
        });

        // Copiar los headers del API real a la respuesta del proxy (importante para CORS y otros)
        response.headers.forEach((value, name) => {
            // Evitar duplicados si Express ya los establece (ej. Content-Type)
            if (!res.headersSent || name.toLowerCase() !== 'content-type') {
                res.setHeader(name, value);
            }
        });

        // Asegurarse de que el estado HTTP se copie
        res.status(response.status);

        const text = await response.text();
       
        // Intenta devolver JSON si se puede, de lo contrario, envía texto plano
        try {
            res.json(JSON.parse(text));
        } catch {
            res.send(text);
        }

    } catch (error) {
        console.error('❌ Error en el proxy:', error.message);
        res.status(500).json({ error: 'Error en el proxy', detail: error.message });
    }
});

// ✅ DESPUÉS del proxy, servir los archivos estáticos del frontend
// Esto significa que si la ruta no es /api/gestion, buscará un archivo estático.
// Asegúrate de que la carpeta 'public' contenga tu 'index.html', y tus subcarpetas 'html', 'js', etc.
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para la página principal (opcional, si quieres que 'localhost:3000/' muestre tu index)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor de Node.js (Proxy + Frontend) funcionando en http://localhost:${PORT}`);
    console.log(`Las llamadas a /api/gestion/* serán reenviadas a http://tiendabackend.runasp.net/api/gestion/*`);
});