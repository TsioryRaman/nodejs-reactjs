// Imports
var express = require('express');
var bodyParser = require('body-parser');
var apiRouter = require('./apiRouter').router;
var cors = require("cors")

//Instanciate server
var server = express();

//Allow cross-origin
server.use(cors());

//Body Parser Config
server.use(bodyParser.urlencoded({ extended: true}))
server.use(bodyParser.json())

//Configure route
server.get("/",(req,res)=>{
    res.setHeader('Content-type','text/html');
    
    res.status(200).send("<h1>Bonjour</h1>");
});


server.use('/api/',apiRouter);

//Launch server
server.listen(8080,()=>{
    console.log("Serveur en écoute sur le port 8080 :)")
})