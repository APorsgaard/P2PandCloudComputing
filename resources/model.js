var resources = require('./resources.json');
//module.exports = resources;
var Observable = require('object-observer');
module.exports = Observable.from(resources);
