var httpServer = require('../servers/http'),
    wsServer = require('../servers/websockets'),
    resources = require('../resources/model');

var ledsPlugin = require('../plugins/internal/ledsPlugin'), //#A
    pirPlugin = require('../plugins/internal/pirPlugin'), //#A
    dhtPlugin = require('../plugins/internal/DHT22SensorPlugin'); //#A

// Internal Plugins for sensors/actuators connected to the PI GPIOs
// If you test this with real sensors do not forget to set simulate to 'false'
pirPlugin.start({'simulate': false, 'frequency': 2000}); //#B
ledsPlugin.start({'simulate': false, 'frequency': 10000}); //#B
dhtPlugin.start({'simulate': false, 'frequency': 10000}); //#B

var server = httpServer.listen(resources.pi.port, function (){
   console.info('Server has started');

   wsServer.listen(server);
});
