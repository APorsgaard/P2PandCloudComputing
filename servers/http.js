var express = require('express'),
  actuatorsRoutes = require('./../routes/actuators'),
  sensorRoutes = require('./../routes/sensors'),
  resources = require('./../resources/model'),
  converter = require('./../middleware/converter'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  mqtt = require('mqtt'),
  config = require('../config.json'),
  path = require('path'); 

var thngId=config.thngId; 
var thngUrl='/thngs/'+thngId;
var thngApiKey=config.thngApiKey; 

//var status=false;
var led;
var updateInterval;
var state;

var client = mqtt.connect("mqtts://mqtt.evrythng.com:8883", {
  username: 'authorization',
  password: thngApiKey 
});

client.on('connect', function () {
  client.subscribe(thngUrl+'/properties/');
  client.subscribe(thngUrl+'/actions/all'); // #A
  updateProperty('livenow',true);
  if (! updateInterval) updateInterval = setInterval(updateProperties, 5000);
});

client.on('message', function(topic, message) {
  var resources = topic.split('/');
  if (resources[1] && resources[1] === "thngs"){
    if (resources[2] && resources[2] === thngId){
      if (resources[3] && resources[3] === "properties"){
        var property = JSON.parse(message);
        console.log('Property was updated: '+property[0].key+'='+property[0].value);
      } else if (resources[3] && resources[3] === "actions"){
        var action = JSON.parse(message);
        handleAction(action);
      }
    }
  }
});

function handleAction(action) {
  switch(action.type) {
    case '_setLedState':
      console.log('ACTION: _setLedState changed the '+action.customFields.led +' led');
      led = action.customFields.led;
      state = action.customFields.state;
      if (led === "blue"){
        var blueLed = resources.pi.actuators.leds['1'];
        if (state === "true") {
         blueLed.value = true;
        } else {
         blueLed.value = false;
       }
      }
      if (led === "red"){
        var redLed = resources.pi.actuators.leds['2'];
          if (state === "true") {
           redLed.value = true;
          } else {
           redLed.value = false;
          }
      }
      if (led === "yellow"){
        var yellowLed = resources.pi.actuators.leds['3'];
          if (state === "true") {
           yellowLed.value = true;
          } else {
           yellowLed.value = false;
          }
      }
      updateProperties();
      break;
    default:
      console.log('ACTION: Unknown action type: '+action.type);
      break;
  }
}

function updateProperties() {
  var temperature = resources.pi.sensors.temperature.value;
  updateProperty ('temperature',temperature);

  var humidity = resources.pi.sensors.humidity.value;
  updateProperty ('humidity',humidity);

  var motion = resources.pi.sensors.pir.value;
  updateProperty ('motion',motion);

  var blue = resources.pi.actuators.leds['1'].value;
  updateProperty ('blue',blue);

  var red = resources.pi.actuators.leds['2'].value;
  updateProperty ('red',red);

  var yellow = resources.pi.actuators.leds['3'].value;
  updateProperty ('yellow',yellow);
}

function updateProperty(property,value) {
  client.publish(thngUrl+'/properties/'+property, '[{"value": '+value+'}]');
}


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
  
  app.use(converter()); module.exports = app;

  process.on('SIGINT', function() { 
  updateProperty('livenow',false);
  clearInterval(updateInterval);
	client.end();
  process.exit();
});


