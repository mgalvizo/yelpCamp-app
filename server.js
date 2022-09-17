const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

// Has to be before requiring the main application
process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('Uncaught Exception, shutting down...');
    process.exit(1);
});

// Import app
const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

const connectDB = async () => {
    try {
        await mongoose.connect(DB);
        console.log('DB connection successful');
    } catch (error) {
        console.log(error);
    }
};

connectDB();

const port = process.env.PORT || 3000;

// Start a server
const server = app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('Unhandled Rejection, shutting down...');
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED. shutting down...');
    server.close(() => {
        console.log('Process terminated');
    });
});
