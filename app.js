require('dotenv').config();
const express = require("express");
const expressLayout = require('express-ejs-layouts');

// Express APP
const app = express();
const PORT = 8080 || process.env.PORT;

// Public Folders
app.use(express.static('public'));

// Template Engine
app.use(expressLayout);
app.set('layout','.layouts/main');
app.set('view engine', 'ejs');


//Routes File Listening
app.use('/',require('./server/routes/main'));


// App Listen
app.listen(PORT, () => {
    console.log("App succesfully listend")
});