var mqtt = require('mqtt');

var config = require('../config.json'); // #A 
var thngId=config.thngId; 
var thngUrl='/thngs/'+thngId;
var thngApiKey=config.thngApiKey;
var interval;

console.log('Using Thng #'+thngId+' with API Key: '+ thngApiKey);

var client = mqtt.connect("mqtts://mqtt.evrythng.com:8883", {// #B
  username: 'authorization',
  password: thngApiKey 
});

client.on('connect', function () { // #C
  client.subscribe(thngUrl+'/properties/'); //#D
  updateProperty('livenow', true); //#E

  if (!interval) interval = setInterval(updateProperties, 5000); //#F
});

client.on('message', function (topic, message) { // #G
  console.log(message.toString());
});


function updateProperties () {
  var temperature = (19.5 + Math.random()).toFixed(3); // #H
  updateProperty ('temperature',temperature);
}

function updateProperty (property,value) {
  client.publish(thngUrl+'/properties/'+property, '[{"value": '+value+'}]');
}

// Let's close this connection cleanly
process.on('SIGINT', function() { // #K
  clearInterval(interval);
  updateProperty ('livenow', false);
  client.end();
  process.exit();
});
