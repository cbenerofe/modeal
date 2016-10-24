

var myApp = angular.module('myApp', []);

leases = lease_data;
expenses = expense_data;
scenarios = scenario_data;
//vacancies = vacancy_data;
new_leases = []

retaxes = 633873
cam = 203456
sqft = 248007
mgmt = 60000

start_date = new Date (2017,1,1)
hold_period = 5
end_date = new Date (2022,12,31)

myApp.controller('myController', ['$scope',function($scope) {
  

  $scope.years = []
  
  $scope.leases = leases
  $scope.expenses = expenses
  $scope.scenarios = scenarios
  $scope.scenario = undefined
  $scope.scenario_id = 1
  $scope.expirations = {}
  $scope.new_leases = {}
  
  $scope.$watch('scenario_id', function() {
      $scope.init()
   //  $scope.scenario = $scope.scenarios.filter(function(s) { return s.id === $scope.scenario_id; })[0];
      //$scope.apply();
  });

  $scope.show_nets = false
  $scope.toggle_nets = function() {
    $scope.show_nets = !$scope.show_nets
  }
  
  $scope.show_tenants = false
  $scope.toggle_tenants = function() {
    $scope.show_tenants = !$scope.show_tenants
  }

  $scope.show_vacancies = false
  $scope.toggle_vacancies = function() {
    $scope.show_vacancies = !$scope.show_vacancies
  }

  $scope.show_expirations = false
  $scope.toggle_expirations = function() {
    $scope.show_expirations = !$scope.show_expirations
  }

  $scope.show_new_leases = false
  $scope.toggle_new_leases = function() {
    $scope.show_new_leases = !$scope.show_new_leases
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
    x = get_tenants_rent(lease_id,year,charge,$scope.show_psf,$scope.scenario)
    return x
  }   
  
  $scope.get_years_rent = function(year,charge) {
    x = get_years_rent(year,charge,$scope.show_psf,$scope.scenario)
    return x
  }  
  
  $scope.get_years_new_rent = function(year,charge) {
    x = get_years_new_rent(year,charge,$scope.show_psf)
    return x
  }  
  
  $scope.get_years_total_rent = function(year,charge) {
    x = get_years_total_rent(year,charge,$scope.show_psf,$scope.scenario)
    return x
  }    
  
  $scope.get_years_expense = function(expense_id,year) {
    x = get_years_expense(expense_id,year,$scope.show_psf)
    return x
  } 

  $scope.get_years_occupancy = function(year) {
    x = get_years_occupancy(year,$scope.scenario)
    return x
  } 

  $scope.get_years_vacancy = function(year) {
    x = get_years_vacancy(year,$scope.scenario)
    return x
  }
  
  $scope.get_vacant_spaces = function(year) {
    x = get_vacant_spaces(year,$scope.scenario)
    return x
  } 
  
  $scope.get_new_leases = function(year) {
    x = get_expirations(year,$scope.scenario)
    return x
  } 
  
  $scope.get_tenant_improvements = function(year) {
    x = get_tenant_improvements(year,$scope.scenario)
    return x
  } 
  
  $scope.get_leasing_commissions = function(year) {
    x = get_leasing_commissions(year,$scope.scenario)
    return x
  } 
  
  $scope.get_capex = function(year) {
    x = get_capex(year,$scope.scenario)
    return x
  } 
  /*
  $scope.get_years_expirations = function(year) {
    x = get_expirations(year,$scope.scenario)
    return x
  } 
  */
  
  $scope.get_noi = function (year,psf) {
    i = get_years_total_rent(year,'all',false,$scope.scenario)
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


  $scope.get_cash_flow = function (year,psf) {
    i = $scope.get_noi(year,'all',false)
    //console.log ("i=" + i)
    x = get_tenant_improvements(year,$scope.scenario)
    
    x += get_leasing_commissions(year,$scope.scenario)
    
    x += get_capex(year,$scope.scenario)
    //console.log ("x=" + x)
    cash_flow = i - x
    if (psf == true) {
      return Math.round(cash_flow / sqft * 100) / 100
    } else {
      return cash_flow
    }
  } 

  $scope.init = function() {
    
    year = {}
    $scope.years = []
    year.start_date = new Date(start_date)
    $scope.years.push(year)
    $scope.scenario = $scope.scenarios.filter(function(s) { return s.id === $scope.scenario_id; })[0];
    $scope.expirations[year.start_date.getFullYear()] = get_expirations(year.start_date.getFullYear(),$scope.scenario)

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
    //console.log($scope.expirations)
    
  } 
  
  $scope.init()
  
}]);







