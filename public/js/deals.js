


myApp.controller('dealsController', function($scope, $http,$window, $routeParams) {
  
  $scope.deals = []
  $scope.deal = undefined
  $scope.creatingBuilding = false
  $scope.today = new Date()
    
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
  
  
  $scope.createDeal = function() {
    
    params = {
      name: $scope.deal.name,
      seller: $scope.deal.seller,
      listing_date: $scope.deal.listing_date
    }
    url = api_server + "/api/deals"
    $http.post(url,params)
      .then(function(response) {
        console.log(response)
      });

  }
  
  $scope.saveDeal = function() {
    console.log("save deal")
  }
  
  $scope.deleteDeal = function() {
    console.log("delete deal")
  }

  $scope.toggleCreateBuilding = function() {
    $scope.creatingBuilding = !$scope.creatingBuilding
  }
  $scope.createBuilding = function() {
    console.log("create building")
  }
  
  $scope.saveBuilding = function() {
    console.log("save building")
  }
  
  $scope.deleteBuilding = function() {
    console.log("delete building")
  }
  
});

myApp.directive('checkimage', function() {
   return {
      link: function(scope, element, attrs) {
         element.bind('error', function() {
            element.attr('src', '/images/warehouse-b.jpg'); // set default image
         });
       }
   }
});
