//Import mongoose to handle DB
const mongoose = require ('mongoose');

const connectDB = async () => {
    try {
        //Attempt to connect
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`📦 MongoDB connesso: ${conn.connection.host}`);
        console.log(`🗄️ Database: ${conn.connection.name}`);
    } catch (error) {
        console.error('Errore connessione MongoDB:', error.message);

        //In caso of an errore, it stop the process
        //This way server and the DB are always aligned.
        process.exit(1);
    }
};

//Closing the connection when the App is closed
process.on('SIGINT', async () => {
    await mongoose.connection.close();

    console.log('🔌 Connessione MongoDB chiusa');
    process.exit(0);
});

module.exports = connectDB;