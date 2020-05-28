const express = require('express');
const app = express(),
      bodyParser = require("body-parser");
      port = 3080;

const handlers = require('./handlers');
const middlewares = require('./middlewares');

app.use(bodyParser.json());
app.use(middlewares.authMiddleware);

app.post('/api/auth', handlers.loginHandler);
app.post('/api/signup', handlers.signupHandler);
app.post('/api/placeorder', handlers.placeorderHandler);
app.get('/api/allmanufacturers', handlers.getAllManufacturersHandler); 
app.get('/api/makeformanufacturer', handlers.getMakeForManufacturerHandler); 
app.get('/api/getmodelsformake/:make_name', handlers.getModelsForMakeHandler); 



app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

