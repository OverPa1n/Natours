const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./app');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1)

})

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
// mongoose.connect(process.env.DATABASE_LOCAL, {
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('DB CONNECTION SUCCESSFUL'));



const server = app.listen(port, () => {
    console.log(process.env.NODE_ENV);
    console.log(`Server is listening on ${port}`);
})

process.on('unhandledRejection', err => {
    console.log('UNHANDLER REJECTION! Shutting down...');
    console.log(err.name, err.message);

    server.close(() => {
        process.exit(1)
    })
})



