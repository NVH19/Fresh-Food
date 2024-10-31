const express = require('express');
const configViewEngine = require('./config/viewEngine');
const userRoute = require('./routes/userRoute');
const bodyParser = require('body-parser');
require('dotenv').config();

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.port;


configViewEngine(app);
userRoute(app);
app.get('/test', (req,res) => {
    res.send('succes');
})

app.listen(port, () => {
    console.log("Nodejs running!");
})