var http = require("http");
http.createServer(function(req,res){
    res.writeHeader(200, {'Content-Type': 'text/html;charset=utf8'});
if (req.url === '/temperature') {
    res.end('<h1>Temperature and humidity:</h1>\n<p id="temp1"> </p>');
} else if (req.url === '/motion'){
    res.end('<h1>Motion state:</h1>\n<p id="temp2"> </p>');
} else if (req.url === '/light'){
    res.end('<h1>Light state:</h1>\n<p id="temp3"> </p>');
} else {
    res.end('<p>For temperature sensor data visit: <a href = http://raspberrypi.local:8080/temperature>temperature </a> <br> For motion sensor data visit: <a href = http://raspberrypi.local:8080/motion>motion </a><br> For light sensor data visit: <a href = http://raspberrypi.local:8080/light> light </a></p>');
}
}).listen(8080);
console.log('Server started!');
