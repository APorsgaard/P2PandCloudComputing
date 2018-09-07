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
    res.end('<p>For temperature sensor data visit: <a href = http://raspberrypi.local:8080/temperature>temperature </a> <br> For motion sensor data visit: <a href = http://raspberrypi.local:8080/motion>motion </a><br> For light sensor data visit: <a href = http://raspberrypi.local:8080/light> light </a></p>');
}
}).listen(8080);
console.log('Server started!');

const sensorLib = require('node-dht-sensor')
sensorLib.initialize(22, 12)
const interval_temp = setInterval(() => {
    read()
}, 2000)
let readout

function read () {
    readout = sensorLib.read()
    console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
        'humidity: ' + readout.humidity.toFixed(2) + '%')
};

process.on('SIGINT', () => {
    clearInterval(interval_temp)
    console.log('Bye, bye!')
    process.exit()
})

function getTemperature(){
    return ('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
            'humidity: ' + readout.humidity.toFixed(2) + '%');
}

let temp
const Gpio_motion = require('onoff').Gpio
const sensor = new Gpio_motion(17, 'in', 'both')
sensor.watch((err, value_motion) => {
    temp = value_motion
    if (err) exit(err)
    console.log(value_motion ? 'there is someone!' : 'not anymore!')
})

function exit (err) {
    if (err) console.log('An error occurred: ' + err)
    sensor.unexport()
    console.log('Bye, bye!')
    process.exit()
}

process.on('SIGINT', exit)

function getMotion(){
    return (temp ? 'There is someone!' : 'Not anymore!');
}


function getBlink() {
    return ('Changed LED state to: ' + value_blink);
}

const Gpio_blink = require('onoff').Gpio
const led = new Gpio_blink(4, 'out')
let interval_blink
let value_blink

interval_blink = setInterval(() => {
   value_blink = (led.readSync() + 1) % 2
   led.write(value_blink, () => {
       console.log('Changed LED state to: ' + value_blink)
   })
}, 2000)

process.on('SIGINT', () => {
    clearInterval(interval_blink)
    led.writeSync(0)
    led.unexport()
        console.log('Bye, bye!')
        process.exit()
})

