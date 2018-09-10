var httpServer = require('../servers/http'),
   resources = require('../resources/model');

var server = httpServer.listen(resources.pi.port, function (){
   console.info('Server has started');
});
