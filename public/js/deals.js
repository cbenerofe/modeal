

var dealsApp = angular.module('dealsApp', []);

var api_server = "http://localhost:3050"
//var api_server = "https://modeal-api.herokuapp.com"



dealsApp.controller('dealsController', function($scope, $window) {
  
  $scope.deals = []

    
  $scope.init = function() {
    
    
    url = api_server + "/api/deals"
    $.ajax({context: this, url: url, 
       success: function(result) { 
         $scope.deals = result
         $scope.$apply();
       }, 
       error: function(result) {
         alert("error on get deals")
       }
    });    
    
  } 

  $scope.init()
  
  
});
