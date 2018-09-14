var express = require('express'),
  router = express.Router(),
  resources = require('./../resources/model');

router.route('/').get(function (req, res, next) {
  req.result = resources.pi.actuators;
  next();
});

router.route('/leds').get(function (req, res, next) {
  req.result = resources.pi.actuators.leds;
  next();
});

router.route('/leds/:id').get(function (req, res, next) { //#A
  req.result = resources.pi.actuators.leds[req.params.id];
  next();
}).put(function(req, res, next) { //#B

  var selectedLed = resources.pi.actuators.leds[req.params.id];
  if(selectedLed.value) {
	selectedLed.value = false;
  } else { selectedLed.value = true;
  } //#C
  req.result = selectedLed;
  next();
});

module.exports = router;
