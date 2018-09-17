var express = require('express'),
  actuatorsRoutes = require('./../routes/actuators'),
  sensorRoutes = require('./../routes/sensors'),
  resources = require('./../resources/model'),
  converter = require('./../middleware/converter'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  path = require('path'); var app = express(); app.use(bodyParser.json()); app.use(cors()); app.use('/pi/actuators', actuatorsRoutes); app.use('/pi/sensors', 
sensorRoutes); app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/websocketsClient.html'));
});
app.get('/pi', function (req, res) {
  res.send('This is the WoT-Pi!')
});
app.use(converter()); module.exports = app;
