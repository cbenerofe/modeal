

var myApp = angular.module('myApp', []);

leases = lease_data;
expenses = expense_data;
retaxes = 633873
cam = 188802
sqft = 248007

myApp.controller('myController', ['$scope',function($scope) {
  
  var start_date = new Date (2017,1,1)
  var hold_period = 5
  $scope.years = []

  
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
  
  $scope.show_psf = false
  $scope.toggle_psf = function() {
    $scope.show_psf = !$scope.show_psf
  }
  
  $scope.get_tenants_rent = function(lease_id,year,charge) {
    x = get_tenants_rent(lease_id,year,charge,$scope.show_psf)
    return x
  }   
  
  $scope.get_years_rent = function(year,charge) {
    x = get_years_rent(year,charge,$scope.show_psf)
    return x
  }   
  
  $scope.get_years_expense = function(expense_id,year) {
    x = get_years_expense(expense_id,year,$scope.show_psf)
    return x
  } 

  $scope.get_noi = function (year,psf) {
    i = get_years_rent(year,'all')
    //console.log ("i=" + i)
    x = get_years_expense('all',year)
    //console.log ("x=" + x)
    noi = i - x
    if (psf == true) {
      return Math.round(noi / sqft * 100) / 100
    } else {
      return noi
    }
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







