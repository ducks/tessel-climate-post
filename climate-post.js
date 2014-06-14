var http = require('http');
var tessel = require('tessel');
var climatelib = require('climate-si7005');

var climate = climatelib.use(tessel.port['A']);

var postData = {};

var options = {
  hostname: 'HOSTNAME',
  headers: {
    'content-type': 'application/json'
  },
  port: PORT,
  path: 'PATH',
  method: 'POST'
};

climate.on('ready', function() {
  setImmediate(function loop () {
    climate.readTemperature('c', function (err, temp) {
      climate.readHumidity(function (err, humid) {
        postData.temp = temp.toFixed(4);
        postData.humid = humid.toFixed(4);

        sendPostRequest(postData);
        setTimeout(loop, 60000);
      });
    });
  });
});

function sendPostRequest(postData) {
  var req = http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
  });

  req.write(JSON.stringify(postData));
  req.end();

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
}
