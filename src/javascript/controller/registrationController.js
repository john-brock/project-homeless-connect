/*
Copyright (c) 2014, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
(function(){

  var registrationController = function($rootScope, $scope, $element, appModel, userService){
    console.log('new registrationController!!');

    // make appModel available to all scopes
    $rootScope.appModel = appModel;

    $scope.world = "Salesforce UX"

    $scope.user = {
      "username" : "",
      "email" : "",
      "password" : "",
      "confirmPassword" : "",
      "nickname" : ""
    };

    $scope.$watch('user', function(n,o){
      $scope.user.username = $scope.user.email;
      // console.log($scope.user);
    }, true);
    
    $scope.submit = function(){
      userService.registerUser(function(result){
        console.log(result);
      }, $scope.user);  
    };
    
  }

  registrationController.$inject = [
    '$rootScope',
    '$scope',
    '$element',
    'appModel',
    'userService'
  ];

  module.exports = registrationController;

}).call(this);
