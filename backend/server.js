const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ListeningTime = require('./models/userListeningTimeModel'); // Modelo importado correctamente

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/Statsify', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conectado a MongoDB');
    })
    .catch(err => {
        console.error('Error al conectar con MongoDB:', err);
    });

// Endpoint para guardar el tiempo de escucha
app.post('/api/saveListeningTime', async (req, res) => {
    const { userId, time } = req.body;

    try {
        let userListeningTime = await ListeningTime.findOne({ userId });

        if (userListeningTime) {
            userListeningTime.listeningTimes.push({ time, date: new Date() });
            await userListeningTime.save();
        } else {
            userListeningTime = new ListeningTime({
                userId,
                listeningTimes: [{ time, date: new Date() }],
            });
            await userListeningTime.save();
        }

        res.status(200).json({ message: 'Time saved successfully' });
    } catch (error) {
        console.error('Error saving time:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint para obtener los tiempos de escucha
app.get('/api/getListeningTimes/:userId', async (req, res) => {
    const { userId } = req.params;
    const accessToken = req.headers.authorization?.split(' ')[1]; // Obtenemos el token del header

    try {
        // Buscar los tiempos de escucha del usuario en la base de datos
        let userListeningTime = await ListeningTime.findOne({ userId });

        if (!userListeningTime) {
            userListeningTime = new ListeningTime({ userId, listeningTimes: [] }); // Si no existe, inicializamos
        }

        // Verificar si ya existe la sumatoria de hoy
        const today = new Date();
        const todayDate = new Date(today.setHours(0, 0, 0, 0)); // Setear la hora a medianoche para comparar solo la fecha

        const existingSum = userListeningTime.listeningTimes.find(item => {
            const itemDate = new Date(item.date).setHours(0, 0, 0, 0); // Compara solo la fecha (sin la hora)
            return itemDate === todayDate.getTime();
        });

        if (!existingSum) {
            console.log('No data for today, fetching from Spotify...');
            // Si no hay datos de hoy, obtener los tiempos desde la API de Spotify
            const listeningData = await fetchSpotifyData(accessToken);

            // Calcular la sumatoria de los tiempos de escucha para hoy
            const totalListeningTime = listeningData.reduce((total, item) => total + item.time, 0);

            // Guardamos la nueva sumatoria para el día de hoy
            userListeningTime.listeningTimes.push({
                time: totalListeningTime,  // Sumatoria de hoy
                date: new Date(), // Fecha de hoy
            });

            // Guardar los cambios en la base de datos
            await userListeningTime.save();

            res.status(200).json({
                listeningTimes: userListeningTime.listeningTimes, // Todos los tiempos de escucha
                totalListeningTime: totalListeningTime, // La sumatoria
            });
        } else {
            // Si ya existe la sumatoria para hoy, devolverla
            const todaySum = existingSum.time;
            res.status(200).json({
                listeningTimes: userListeningTime.listeningTimes,
                totalListeningTime: todaySum, // Regresar la sumatoria de hoy
            });
        }
    } catch (error) {
        console.error('Error fetching listening times:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Función para comprobar si los datos son del día actual
function isDataFromToday(userListeningTime) {
    const lastDataDate = userListeningTime.listeningTimes[0]?.date;
    const today = new Date().setHours(0, 0, 0, 0);
    return lastDataDate && new Date(lastDataDate).setHours(0, 0, 0, 0) === today;
}

// Función para obtener los datos de escucha de Spotify
async function fetchSpotifyData(accessToken) {
    const recentTracksUrl = 'https://api.spotify.com/v1/me/player/recently-played';

    const response = await fetch(recentTracksUrl, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();
    return data.items.map(item => ({
        time: item.track.duration_ms / 60000, // Convertir a minutos
        date: new Date(item.played_at), // Usar la fecha de reproducción exacta de la API
    }));
}




app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
