// server code
// password - 7XmCaziQiVV5eoAJ



const express = require('express');
const app = express(),
      bodyParser = require("body-parser");

const handlers = require('./handlers');
const middlewares = require('./middlewares');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist/'));
app.use(middlewares.authMiddleware);

app.post('/api/auth', handlers.loginHandler);
app.post('/api/signup', handlers.signupHandler);
app.post('/api/placeorder', handlers.placeorderHandler);
app.get('/api/allmanufacturers', handlers.getAllManufacturersHandler); 
app.get('/api/makeformanufacturer', handlers.getMakeForManufacturerHandler); 
app.get('/api/getmodelsformake/:make_name', handlers.getModelsForMakeHandler); 



app.listen(process.env.PORT || 3080, () => {
    console.log(`Server listening on the port::${process.env.PORT || 3080}`);
});

