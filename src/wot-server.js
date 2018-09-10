var httpServer = require('./Servers/http'),
   resources = require('./Resources/model');

var server = httpServer.listen(resources.pi.port, function (){
   console.info('Server has started');
});
