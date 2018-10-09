


buildingId = undefined

myApp.controller('buildingController', function($scope, $window) {
  
  $scope.$on('renit', function(event, args) {
    $scope.init();
  });

  $scope.init = function() {  

    if (buildingId != undefined) {
      url = api_server + "/api/buildings/" + buildingId
      $.ajax({context: this, url: url, 
         success: function(result) { 
           $scope.building = result
           
           url = api_server + "/api/deals/" + $scope.building.dealId
           $.ajax({context: this, url: url, 
              success: function(result) { 
                $scope.deal = result
                $scope.$apply();
              }, 
              error: function(result) {
                alert("error on get deal")
              }
           }); 
           
         }, 
         error: function(result) {
           alert("error on get building")
         }
      });  
      
      url = api_server + "/api/buildings/" + buildingId + "/leases"
      $.ajax({context: this, url: url, 
         success: function(result) { 
           $scope.leases = result
           $scope.$apply();
         }, 
         error: function(result) {
           alert("error on get leases")
         }
      }); 
      
      url = api_server + "/api/buildings/" + buildingId + "/expenses"
      $.ajax({context: this, url: url, 
         success: function(result) { 
           $scope.expenses = result
           $scope.$apply();
         }, 
         error: function(result) {
           alert("error on get expenses")
         }
      }); 

    }
    
  } 

  $scope.init()
  
  $scope.setBuilding = function(id) {
    buildingId = id
    $scope.init();
  }
  
  $scope.toggleCreateLease = function() {
    $scope.creatingLease = !$scope.creatingLease
  }
  
  $scope.toggleCreateExpense = function() {
    $scope.creatingExpense = !$scope.creatingExpense
  }
  
  $scope.createLease = function() {
    console.log("create lease")
  }
  
  $scope.saveLease = function() {
    console.log("save lease")
  }
  
  $scope.deleteLease = function() {
    console.log("delete lease")
  }

  $scope.createExpense = function() {
    console.log("create expense")
  }
  
  $scope.saveExpense = function() {
    console.log("save expense")
  }
  
  $scope.deleteExpense = function() {
    console.log("delete expense")
  }
  
  
});
