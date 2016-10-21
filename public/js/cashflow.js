

var myApp = angular.module('myApp', []);

leases = lease_data;
expenses = expense_data;


myApp.controller('myController', ['$scope',function($scope) {
  
  var start_date = new Date (2017,1,1)
  var hold_period = 5
  $scope.years = []
  retaxes = 633873
  cam = 188802
  
  $scope.leases = leases
  $scope.expenses = expenses

  $scope.show_nets = false
  $scope.toggle_nets = function() {
    $scope.show_nets = !$scope.show_nets
  }
  
  $scope.show_tenants = false
  $scope.toggle_tenants = function() {
    $scope.show_tenants = !$scope.show_tenants
  }

  $scope.show_expenses = false
  $scope.toggle_expenses = function() {
    $scope.show_expenses = !$scope.show_expenses
  }
  
  
  $scope.get_tenants_rent = function(lease_id,year,charge) {
    x = get_tenants_rent(lease_id,year,charge)
    return x
  }   
  
  $scope.get_years_rent = function(year,charge) {
    x = get_years_rent(year,charge)
    return x
  }   
  
  $scope.get_years_expense = function(expense_id,year) {
    x = get_years_expense(expense_id,year)
    return x
  }  

  $scope.init = function() {
    year = {}
    year.start_date = new Date(start_date)
    $scope.years.push(year)
    for (i=1; i<hold_period;i++){
      year = {}
      year.start_date = new Date(start_date)
      year.start_date.setFullYear(year.start_date.getFullYear() + i)
      $scope.years.push(year)
    }

  } 
  
  $scope.init()
  
}]);







