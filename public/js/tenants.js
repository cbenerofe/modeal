

myApp.controller('tenantsController', ['$scope',function($scope) {
  
  $scope.get_years_new_sqft = function(year) {
    x = get_years_new_sqft(year)
    return x
  } 

  $scope.get_new_leases_in_year = function(year) {
    x = get_new_leases_in_year(year)
    return x
  } 

  $scope.check_lease_in_year = function(lease,year) {
    x = check_lease_in_year(lease,year)
    return x
  } 

  $scope.check_lease_start_in_year = function(lease,year) {
    x = check_lease_start_in_year(lease,year)
    return x
  } 

  $scope.get_lease_periods = function(lease, year) {
    x = get_lease_periods(lease,year,scenario)
    return x
  }   
  
  $scope.period_months_in_year = function(period, year) {
    x = period_months_in_year(period,year)
    return x
  }   
  
  $scope.get_lease_rent = function(lease, year,charge) {
    x = get_lease_rent(lease,year,charge,$scope.show_psf)
    return x
  } 
  
  $scope.get_years_total_rent = function(year,charge) {
    x = get_years_total_rent(year,charge,$scope.show_psf)
    return x
  }    

  $scope.get_tenant_improvements = function(year) {
    x = get_tenant_improvements(year)
    return x
  } 
  
  $scope.get_leasing_commissions = function(year) {
    x = get_leasing_commissions(year)
    return x
  } 


  
}]);







