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
app.get('/api/allmanufacturers', handlers.getAllManufacturersHandler); 
app.get('/api/makeformanufacturer/:man_id', handlers.getMakeForManufacturerHandler); 
app.get('/api/getmodelsformake/:make', handlers.getModelsForMakeHandler); 


app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

