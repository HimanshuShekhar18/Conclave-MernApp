const mongoose = require('mongoose');

function DbConnect() {
    console.log(process.env.DB_URL);
    // Database connection
    mongoose.connect(process.env.DB_URL);
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('DB connected...');
    });
}

module.exports = DbConnect;