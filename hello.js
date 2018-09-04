var http = require("http");
http.createServer(function(req,res){
    res.writeHeader(200, {'Content-Type': 'text/html;charset=utf8'});
if (req.url === '/temperature') {
    res.end('<p>Temperature and humidity:</p>\n'+ getTemperature());
} else if (req.url === '/motion'){
    res.end('<p>Motion state:</p>\n'+getMotion());
} else if (req.url === '/light'){
    res.end('<p>Light state:</p>\n'+getBlink());
} else {
    res.end('<p>For temperature sensor data visit: <a href = http://localhost:8080/temperature>Temperature </a> <br> For motion sensor data visit: <a href = http://localhost:8080/motion>motion </a><br> For light sensor data visit: <a href = http://localhost:8080/light> light </a></p>');
}
}).listen(8080);
console.log('Server started!');

function getData(){
	return "Data placeholder";
}

function getTemperature(){
    /*const sensorLib = require('node-dht-sensor')
    sensorLib.initialize(22, 12)
    const interval = setInterval(() => {
        read()
    }, 2000)
    function read () {
        let readout = sensorLib.read()
        console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
        'humidity: ' + readout.humidity.toFixed(2) + '%')
    };
    process.on('SIGINT', () => {
    clearInterval(interval)
    console.log('Bye, bye!')
    process.exit()
    })
    return ('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
                   'humidity: ' + readout.humidity.toFixed(2) + '%')*/
    return "30 C";
}

function getMotion() {
    /*const Gpio = require('onoff').Gpio
    const sensor = new Gpio(17, 'in', 'both')
    sensor.watch((err, value) => {
    if (err) exit(err)
    console.log(value ? 'there is someone!' : 'not anymore!')
    })
    function exit (err) {
    if (err) console.log('An error occurred: ' + err)
    sensor.unexport()
    console.log('Bye, bye!')
    process.exit()
    }
    process.on('SIGINT', exit)
    return (value ? 'there is someone!' : 'not anymore!');*/
    return "There is someone";
}

function getBlink() {
    /*const Gpio = require('onoff').Gpio
    const led = new Gpio(4, 'out')
    let interval
    interval = setInterval(() => {
        let value = (led.readSync() + 1) % 2
        led.write(value, () => {
            console.log('Changed LED state to: ' + value)
        })
    }, 2000)
    process.on('SIGINT', () => {
          clearInterval(interval)
        led.writeSync(0)
        led.unexport()
        console.log('Bye, bye!')
        process.exit()
    })
    return ('Changed LED state to: ' + value);*/
    return 'Changed LED state to on';
}
