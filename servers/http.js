var express = require('express'),
  actuatorsRoutes = require('./../routes/actuators'),
  sensorRoutes = require('./../routes/sensors'),
  resources = require('./../resources/model'),
  converter = require('./../middleware/converter'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  path = require('path');

var app = express();


app.use(bodyParser.json());

app.use(cors());

app.use('/pi/actuators', actuatorsRoutes);
app.use('/pi/sensors', sensorRoutes);


app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});

/*app.get('/',function(req,res){ 
  fs.readFile('index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
});*/

app.get('/pi', function (req, res) {
  res.send('This is the WoT-Pi!')
});

app.use(converter());
module.exports = app;

