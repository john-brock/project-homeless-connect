// app.js
var express = require('express');
var nforce = require('nforce');
var app = module.exports = express();

var org = nforce.createConnection({
  clientId: '3MVG98RqVesxRgQ4FWNuASfzkkMk7Q4GoirDGWu4B26dRYAAXQPOX581mVxmCeTzCMnQpBlUUJ45bRpMd9lHs',
  clientSecret: '8077703699761074725',
  redirectUri: 'http://localhost:5000/oauth/_callback'
});

var port = Number(process.env.PORT || 5000);

// Configuration
app.configure(function(){
	//app.set('views', __dirname + '/views');
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'ProjectHomelessConnect-Secret' }));
  app.use(org.expressOAuth({onSuccess: '/userinfo', onError: '/oauth/error'}));
  app.use(app.router);
  app.use(express.static(__dirname + '/www'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/hello', function(req, res){
  res.send('Hello');
});

app.get('/login', function(req, res){
  res.redirect(org.getAuthUri());
});

app.get('/userinfo', function(req, res) {
  org.getIdentity({oauth: req.session.oauth}, function(err, resp) {
    if(err) {
      res.send(err.message);
    } else {
      res.send(resp);
    }
  });
});

app.get('/register', function(req, res) {
  var user = req.user;
  /*var user = {
    "username":"jbrock@phctest3.com",
    "nickname":"jbrock@phctest3.com",
    "email":"jbrock@salesforce.com",
    "password":"test1234",
    "confirmPassword":"test1234"
  };*/
  org.apexRest({uri:'register',method:'POST', body: JSON.stringify(user)}, function(err, resp) {
    if(err) {
      res.send(err.message);
    } else {
      res.send(resp);
    }
  });
});

app.get('/password/change', function(req, res) {
  //var info = req.password;
  var idString = JSON.stringify(req.session.oauth.id);
  var userId = idString.substring(idString.length - 19, idString.length-1);
  var info = {
    "userId":userId,
    "newPassword":"test1test"
  };
  org.apexRest({uri:'password/change',method:'POST',body:JSON.stringify(info)}, function(err, resp) {
    if(err) {
      res.send(err.message);
    } else {
      res.send(resp);
    }
  });
});

app.get('/password/reset', function(req, res) {
  //var username = req.user.username;
  var user = {
    "username":"jbrock@phc.com"
  }
  org.apexRest({uri:'password/reset',method:'POST',body:JSON.stringify(user)}, function(err, resp) {
    if(err) {
      res.send(err.message);
    } else {
      res.send(resp);
    }
  });
});

app.listen(port);
console.log("Express server listening on port %d in %s mode", port, app.settings.env);
