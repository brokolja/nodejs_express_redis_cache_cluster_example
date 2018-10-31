var express = require('express');
var cluster = require('express-cluster');
var cache = require('express-redis-cache')({
  host: process.env.REDIS_HOST || "localhost", port: process.env.REDIS_PORT || 6379, expire: 60
  });

cache.on('message', function (message) {
  console.log("cache messege: ",message)
});

cache.on('connected', function () {
  console.log("cache connected")
});

cache.on('disconnected', function () {
  console.log("cache disconnected")
});

cluster(function (worker) {

  var app = express();
  
  app.get('/', cache.route(), function (req, res) {
    res.send('Hello World from worker #' + worker.id + "! We are shipping Nodejs-Version: " + process.version);
  });

  app.listen(process.env.PORT || 8080, function () {
    console.log('Worker #' + worker.id + ' listening on port:' + (process.env.PORT || 8080));
  });
}, {
    verbose: true,
});