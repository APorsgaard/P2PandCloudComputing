var resources = require('./../../resources/model');

var actuator, interval;

var model1 = resources.pi.actuators.leds['1'],
    model2 = resources.pi.actuators.leds['2'],
    model3 = resources.pi.actuators.leds['3'];

var pluginName1 = model1.name,
 pluginName2 = model2.name,
 pluginName3 = model3.name;
var localParams = {'simulate': false, 'frequency': 2000};

exports.start = function (params) {
  localParams = params;
   resources.observe(changes => {
    changes.forEach(change => {
      if (change.type === 'update' &&
          model1  === change.path.slice(0, -1).reduce((obj, i) => obj[i], resources)) {
		switchOnOff(change.value, model1);
      }
	    else if (change.type === 'update' &&
          model2  === change.path.slice(0, -1).reduce((obj, i) => obj[i], resources)) {
        switchOnOff(change.value, model2);
      }
	    else if (change.type === 'update' &&
          model3 === change.path.slice(0, -1).reduce((obj, i) => obj[i], resources)) {
		switchOnOff(change.value, model3);
      }
    });
  });

  if (localParams.simulate) {
    simulate();
  } else {
    connectHardware();
  }
};

exports.stop = function () {
  if (localParams.simulate) {
    clearInterval(interval);
  } else {
    actuator1.unexport();
    actuator2.unexport();
    actuator3.unexport();
  }
  console.info('%s plugin stopped!', pluginName);
};

function switchOnOff(value,model) {
	if (!localParams.simulate) {
		if(pluginName1===model.name){
			actuator1.write(value === true ? 1 : 0, function () { //#C
				console.info('Changed value of %s to %s', pluginName1, value);
			});
		}
		else if(pluginName2===model.name){
			actuator2.write(value === true ? 1 : 0, function () { //#C
				console.info('Changed value of %s to %s', pluginName2, value);
			});
		}
		else if(pluginName3===model.name){
			actuator3.write(value === true ? 1 : 0, function () { //#C
				console.info('Changed value of %s to %s', pluginName3, value);
			});
		}
	};
}

function connectHardware() {
  var Gpio = require('onoff').Gpio;
  actuator1 = new Gpio(model1.gpio, 'out');
  actuator2 = new Gpio(model2.gpio, 'out');
  actuator3 = new Gpio(model3.gpio, 'out');
  console.info('Hardware %s actuator started!', pluginName1);
  console.info('Hardware %s actuator started!', pluginName2);
  console.info('Hardware %s actuator started!', pluginName3);
};

function simulate() {
  interval = setInterval(function () {
    // Switch value on a regular basis
    if (model1.value) {
      model1.value = false;
    } else if (model2.value) {
      model2.value = false;
    } else if (model3.value){
      model3.value = false;
    } else {
      model1.value = true;
      model2.value = true;
      model3.value = true;
    }
  }, localParams.frequency);
  console.info('Simulated %s actuator started!', pluginName);
}
