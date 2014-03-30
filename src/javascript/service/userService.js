(function() {
  var userService;
  
  userService = function($http) {
    return {
      registerUser : function(callback, user){
        console.log(user);
        return $http.post("/register", {
          cache: true,
          params: user
        }).success(function(result){
          callback(result);
        }).error(function(err){
          console.log(err);
        });
      },
      getUserInfo : function(){
        return $http.get('/userinfo')
      }

    };
  };

  userService.$inject = ['$http'];

  module.exports = userService;

}).call(this);