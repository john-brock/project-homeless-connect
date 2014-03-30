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
  app.use(express.session({ secret: 'nforce testing baby' }));
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
  /*org.authenticate({username: un, password: pw}, function(err, resp) {
    if(err) {
      res.send(err.message);
    } else {
      res.json(resp);
    }
  });*/
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
  org.apexRest({uri:'password/reset',method:'POST',body:JSON.stringify(info)}, function(err, resp) {
    if(err) {
      res.send(err.message);
    } else {
      res.send(resp);
    }
  });
});

app.get('/test/query', function(req, res) {
  var query = 'SELECT Id, Name, CreatedDate FROM Account ORDER BY CreatedDate DESC LIMIT 5';
  org.query({query: query, oauth: req.session.oauth}, function(err, resp) {
    if(!err) {
      res.send(resp.records);
    } else {
      res.send(err.message);
    }
  });
});

app.listen(port);
console.log("Express server listening on port %d in %s mode", port, app.settings.env);
