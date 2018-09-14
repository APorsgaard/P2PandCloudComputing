$(document).ready(
 function doPoll1(){
   $.getJSON('http://raspberrypi.local:8080/pi/sensors/temperature',
     function(data){
     console.log(data);
     $('#temp1').html(data.value + '' + data.unit);
     setTimeout(doPoll1, 5000);
   });
});


