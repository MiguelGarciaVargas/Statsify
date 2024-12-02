const mongoose = require('mongoose');

const userListeningTimeSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    listeningTimes: [
        {
            time: { type: Number, required: true }, // Tiempo en minutos
            date: { type: Date, default: Date.now }, // Fecha del registro
        },
    ],
});

const ListeningTime = mongoose.model('ListeningTime', userListeningTimeSchema, 'user_listening_times');
module.exports = ListeningTime;