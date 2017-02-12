
var myApp = angular.module('myApp', []);

myApp.controller('dealsController', ['$scope',function($scope) {
  
  
  $scope.deals = []
  
  /*
  $.ajax({context: this, url: "http://localhost:3000/api/deals", 
     success: function(result) { 
       console.log(JSON.stringify(result))
       $scope.deals = result
       //console.log(JSON.stringify($scope.leases))
       //alert("hey")
       $scope.$apply();
     }, 
     error: function(result) {
       //console.log(JSON.stringify(result));
       alert("error on deals")
     }
  }); 
  */
  
}]);