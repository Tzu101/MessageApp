// Utility libaries
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");


// Init enviorment variables
require('dotenv').config();


// Init server
const express = require("express");
const server = express();
const port = process.env.PORT || 5000;
const connection = server.listen(port, () => {
    console.log(`Live on port ${port}`);
});


// Cross-Origin Resource Sharing enabled
server.use(cors());
server.options('*', cors());


// Enable cookie and body parsing
server.use(cookieParser());
server.use(bodyParser.json());


// Specify files accessible to server
server.use(express.static(__dirname + "/../client/"));
server.use(express.static(__dirname + "/../vue/dist"));


// Server router
require("./modules/router.js")(server);


// Establish socket connection
require("./modules/socket.js")(connection);
