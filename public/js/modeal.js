

var myApp = angular.module('myApp', []);


leases = []
expenses = []
scenarios = []


spaces = space_data
leases = lease_data
expenses = expense_data
scenarios = scenario_data
vacancies = vacancy_data
scenario = undefined

new_leases = {}

retaxes = 600000
cam = 300000
sqft = 643000
mgmt = 100000

start_date = new Date (2017,1,1)
hold_period = 7
end_date = new Date (2023,12,31)

myApp.controller('modealController', ['$scope',function($scope) {
  
  $scope.years = []
  $scope.spaces = spaces
  $scope.leases = leases
  $scope.vacancies = vacancies
  $scope.expenses = expenses
  $scope.scenarios = scenarios
  $scope.scenario = undefined
  $scope.scenario_id = 1
  //$scope.scenario_id = $scope.scenarios[0].id
  $scope.expirations = {}
  $scope.new_leases = {}
  
  $scope.$watch('scenario_id', function() {
    $scope.init()
  });

  $scope.show_nets = false
  $scope.toggle_nets = function() {
    $scope.show_nets = !$scope.show_nets
  }
  
  $scope.show_psf = false
  $scope.toggle_psf = function() {
    $scope.show_psf = !$scope.show_psf
  }
    
  $scope.init = function() {
    
    /*
    $.ajax({context: this, url: "http://localhost:3000/api/leases", 
       success: function(result) { 
         //console.log(JSON.stringify(result))
         leases = result
         $scope.leases = result
         //console.log(JSON.stringify($scope.leases))
         //alert("hey")
         $scope.$apply();
       }, 
       error: function(result) {
         //console.log(JSON.stringify(result));
         alert("error on leases")
       }
    }); 
    
    $.ajax({context: this, url: "http://localhost:3000/api/expenses", 
       success: function(result) { 
         //console.log(JSON.stringify(result))
         expenses = result
         $scope.expenses = result
         //console.log(JSON.stringify($scope.leases))
         //alert("hey")
         $scope.$apply();
       }, 
       error: function(result) {
         //console.log(JSON.stringify(result));
         alert("error on expenses")
       }
    }); 
    
    $.ajax({context: this, url: "http://localhost:3000/api/scenarios", 
       success: function(result) { 
         //console.log(JSON.stringify(result))
         scenarios = result
         $scope.scenarios = result
         //console.log(JSON.stringify($scope.leases))
         //alert("hey")
         $scope.scenario = $scope.scenarios.filter(function(s) { return s.id == $scope.scenario_id; })[0];
         $scope.$apply();
       }, 
       error: function(result) {
         //console.log(JSON.stringify(result));
         alert("error on scenarios")
       }
    });     
    */
    
    scenario = $scope.scenarios.filter(function(s) { return s.id == $scope.scenario_id; })[0];
    $scope.scenario = scenario
     
    year = {}
    $scope.years = []
    year.start_date = new Date(start_date)
    $scope.years.push(year)

    $scope.expirations[year.start_date.getFullYear()] = get_expirations(year.start_date.getFullYear(),$scope.scenario)
    $scope.expirations[year.start_date.getFullYear()] = $scope.expirations[year.start_date.getFullYear()].concat(vacancies)

    for (i=1; i<hold_period;i++) {
      year = {}
      year.start_date = new Date(start_date)
      yearnum = year.start_date.getFullYear() + i
      year.start_date.setFullYear(yearnum)
      $scope.years.push(year)
      //console.log(yearnum)
      $scope.expirations[yearnum] = get_expirations(yearnum,$scope.scenario)
    }
    //console.log($scope.scenario)
    new_leases = get_new_leases($scope.scenario)
    
    $scope.new_leases = new_leases
    
    //console.log("leases:" + JSON.stringify(leases))
    //console.log("new_leases:" + JSON.stringify(new_leases))
    
  } 
  
  //$scope.init()    
    
    
}]);