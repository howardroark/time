var Hapi    = require('hapi');
var Basic   = require('hapi-auth-basic');
var AuthJWT = require('hapi-auth-jwt2')
var Joi     = require('joi');
var ES      = require('esta');  // https://github.com/nelsonic/esta
var port    = process.env.PORT || 1337; // heroku define port or use 1337
var server  = new Hapi.Server();
var secret = 'NeverShareYourSecret'; // @todo use ENV var for this

server.connection({ port: port });

var routes = [
{ path: '/home', method: 'GET',
  config: require('./handlers/home')  },
{ path: '/login', method: 'POST', config: { auth: 'basic' },
  handler: require('./handlers/login.js') },
{ path: '/register', method: 'POST', config: { auth: false },
  handler: require('./handlers/register.js') },
{ path: '/timer/{id}', method: 'GET',
  config: require('./handlers/timer_find.js')  },
{ path: '/timer/new', method: 'POST',
  config: require('./handlers/timer_start.js') }
  // { path: '/timer/{id}', method: 'DELETE', config: T.deleteConfig }
];
// [ {register: Basic}, {register: AuthJWT} ]
server.register(Basic, function (err) {
  // if(err) {
  //   console.log(err);
  // }
  server.auth.strategy('basic', 'basic', {
    validateFunc: require('./handlers/auth_basic.js')
  });
  server.route(routes);
});

server.start(function() {
    console.log('Now Visit: http://localhost:'+port);
});

module.exports = server;
