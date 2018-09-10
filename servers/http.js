var express = require('express'),
  actuatorsRoutes = require('./../Routes/actuators'),
  sensorRoutes = require('./../Routes/sensors'),
  resources = require('./../Resources/model'),
  cors = require('cors');

var app = express();

app.use(bodyParser.json());

app.use(cors());

app.use('/pi/actuators', actuatorsRoutes);
app.use('/pi/sensors', sensorRoutes);

app.get('/pi', function (req, res) {
  res.send('This is the WoT-Pi!')
});

// For representation design
module.exports = app;
