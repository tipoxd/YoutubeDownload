const express = require('express');
const ytdl = require('ytdl-core');
const app = express();

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});

// Ruta para manejar la descarga del video
app.post('/download', async (req, res) => {
    const videoURL = req.query.url; // Obtiene la URL del query parameter 'url'

    try {
        // Verifica si la URL es válida
        if (!ytdl.validateURL(videoURL)) {
            throw new Error('La URL proporcionada no es válida.');
        }

        // Configura la respuesta HTTP para descargar el video como un archivo
        res.header('Content-Disposition', 'attachment; filename="video_descargado.mp4"');
        ytdl(videoURL, {
            format: 'mp4' // Descarga el video en formato MP4
        }).pipe(res); // Pipe la respuesta para descargar el video

    } catch (error) {
        res.status(400).send(`Error: ${error.message}`);
    }
});

// Inicia el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT} |  ${__dirname + '/dist/index.html'}`);
});
