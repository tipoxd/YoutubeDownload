// Antes de la creación de los sockets, establece un límite más alto
require('events').EventEmitter.defaultMaxListeners = 15; // Establece el límite más alto


const express = require('express');
const path = require('path');
const ytdl = require('ytdl-core');


const app = express();
const bodyParser = require('body-parser');
const model_data_downloader = require('./models/config');


// Middleware para parsear el body de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Sirve los archivos estáticos desde la carpeta 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Ruta para manejar la descarga del video
app.post('/download', async (req, res) => {



    try {

        const quality = req.body.quality;
        const videoURL = req.body.link;

        if (!ytdl.validateURL(videoURL)) {
            return res.status(400).send('URL de video de YouTube no válida');
        }

        const info = await ytdl.getInfo(videoURL);


        // Busca el formato que coincida con la calidad seleccionada por el usuario
        const format = info.formats.find(format => format.qualityLabel === quality);

        // const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' }); // Selecciona la mejor calidad de video disponible

        if (!format) {
            return res.status(400).send('No se pudo encontrar un formato de video');
        }

        res.header('Content-Disposition', `attachment; filename="${info.title}.mp4"`);
        ytdl(videoURL, { format }).pipe(res); // Pasa el flujo de datos al response (frontend)

    } catch (error) {
        res.status(500).send('Error al descargar el video: ' + error.message);
    }
});

app.post('/videoInfo', async (req, res) => {
    try {
        const videoURL = req.body.url_website;
        if (!ytdl.validateURL(videoURL)) {
            return res.status(400).send('URL de video de YouTube no válida');
        }

        // Obtener información sobre el video
        const info = await ytdl.getInfo(videoURL);



        let tableData = model_data_downloader.youtube;
        tableData.thumbnails = info.videoDetails.thumbnails[3].url;
        tableData.title = info.videoDetails.title;
        tableData.urlprofile = info.videoDetails.ownerProfileUrl;
        
        // Recorre los formatos y almacena los datos en tableData
        info.formats.forEach(format => {
            if (format.contentLength) {
                let totalSize = parseInt(format.contentLength);
                let totalSizeInMB = totalSize / (1024 * 1024);

                tableData.result.push({
                    qualityLabel: format.qualityLabel,
                    quality: format.quality,
                    sizeInMB: totalSizeInMB.toFixed(2),
                    url: videoURL
                });
            }
        });

        // Ordenar tableData por tamaño de mayor a menor
        tableData.result.sort((a, b) => b.sizeInMB - a.sizeInMB);

        return res.status(200).send(tableData);
    } catch (error) {
        res.status(500).send('Error al descargar el video: ' + error.message);
    }
});



// Inicia el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT} |  ${__dirname + '/dist/index.html'}`);
});
