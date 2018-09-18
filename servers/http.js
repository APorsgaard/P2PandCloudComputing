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

var status=false;
var updateInterval;

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
  if (resources[1] && resources[1] === "thngs"){ // #B
    if (resources[2] && resources[2] === thngId){  // #C
      if (resources[3] && resources[3] === "properties"){ //#D
        var property = JSON.parse(message);
        console.log('Property was updated: '+property[0].key+'='+property[0].value); 
      } else if (resources[3] && resources[3] === "actions"){ //#E
        var action = JSON.parse(message);
        handleAction(action); 
      }
    }
  }
});

function handleAction(action) {
  switch(action.type) { // #F
    case '_setStatus':
      console.log('ACTION: _setStatus changed to: '+action.customFields.status); // #G
      status=Boolean(action.customFields.status);
      updateProperty ('status',status);
      /* Do something else too */
      break;
    case '_setLevel':
      console.log('ACTION: _setLevel changed to: '+action.customFields.level);
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

  var motion = resources.pi.sensors.pir.value + " ";
  updateProperty ('motion',motion);

  var blueLed = resources.pi.actuators.leds['1'].value;
  updateProperty ('blueLed',blueLed);
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
  res.sendFile(path.join(__dirname+'/websocketsClient.html'));
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

