require('dotenv').config();

const express = require("express");
const session = require('express-session')
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo').default;

// Database connection 
const connectDB = require('./server/config/db')
connectDB();

// Express APP
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
}));

// Public Folders
app.use(express.static('public'));

// Template Engine
app.use(expressLayout);
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');


//Routes File Listening
app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin.js'));


// App Listen
app.listen(PORT, () => {
    console.log("App succesfully listend")
});
