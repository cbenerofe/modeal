



myApp.controller('leaseController', function($scope, $window) {
  
  $scope.deals = []

    
  $scope.init = function() {  

    if (leaseId != undefined) {
      url = api_server + "/api/leases/" + leaseId
      $.ajax({context: this, url: url, 
         success: function(result) { 
           $scope.lease = result
           
           url = api_server + "/api/buildings/" + $scope.lease.buildingId
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
                
                $scope.$apply();
              }, 
              error: function(result) {
                alert("error on get building")
              }
           }); 
           
         }, 
         error: function(result) {
           alert("error on get lease")
         }
      });  

    }


  } 

  $scope.init()
  
  
  $scope.createLeasePeriod = function() {
    console.log("create lease period")
  }
  
  $scope.saveLeasePeriod = function() {
    console.log("save lease period")
  }
  
  $scope.deleteLeasePeriod = function() {
    console.log("delete lease period")
  }


  
  
});
