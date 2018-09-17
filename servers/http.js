var express = require('express'),
  actuatorsRoutes = require('./../routes/actuators'),
  sensorRoutes = require('./../routes/sensors'),
  resources = require('./../resources/model'),
  converter = require('./../middleware/converter'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  path = require('path'),
  mqtt = require('mqtt'),
  config = require('./../src/config.json');

var thngId=config.thngId; 
var thngUrl='/thngs/'+thngId;
var thngApiKey=config.thngApiKey;
var interval;

console.log('Using Thng #'+thngId+' with API Key: '+ thngApiKey);

var client = mqtt.connect("mqtts://mqtt.evrythng.com:8080", {// #B
  username: 'authorization',
  password: thngApiKey 
});

var app = express();

app.use(bodyParser.json());

app.use(cors());

app.use('/pi/actuators', actuatorsRoutes);
app.use('/pi/sensors', sensorRoutes);


app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/pi', function (req, res) {
  res.send('This is the WoT-Pi!')
});

app.use(converter());
module.exports = app;


