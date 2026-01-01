require('dotenv').config();

const express = require("express");
const expressLayout = require('express-ejs-layouts');

// Database connection 
const connectDB = require('./server/config/db')
connectDB();

// Express APP
const app = express();
const PORT = process.env.PORT || 8080 ;

// Public Folders
app.use(express.static('public'));

// Template Engine
app.use(expressLayout);
app.set('layout','layouts/main');
app.set('view engine', 'ejs');


//Routes File Listening
app.use('/',require('./server/routes/main'));


// App Listen
app.listen(PORT, () => {
    console.log("App succesfully listend")
});
