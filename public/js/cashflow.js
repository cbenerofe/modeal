

myApp.controller('cashflowController', ['$scope',function($scope) {
  

  $scope.show_vacancies = false
  $scope.toggle_vacancies = function() {
    $scope.show_vacancies = !$scope.show_vacancies
  }

  $scope.show_new_leases = false
  $scope.toggle_new_leases = function() {
    $scope.show_new_leases = !$scope.show_new_leases
  }

  $scope.show_expenses = false
  $scope.toggle_expenses = function() {
    $scope.show_expenses = !$scope.show_expenses
  }

  $scope.check_lease_in_year = function(lease,year) {
    x = check_lease_in_year(lease,year)
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
  
  $scope.get_years_expense = function(expense_id,year) {
    x = get_years_expense(expense_id,year,$scope.show_psf)
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
  
  $scope.get_capex = function(year) {
    x = get_capex(year, $scope.show_psf)
    return x
  } 

  
  $scope.get_noi = function (year) {
    i = get_years_total_rent(year,'all')
    //console.log ("i=" + i)
    x = get_years_expense('all',year)
    //console.log ("x=" + x)
    noi = i - x
    if ($scope.show_psf == true) {
      return Math.round(noi / sqft * 100) / 100
    } else {
      return noi
    }
  } 


  $scope.get_cash_flow = function (year) {
    i = get_years_total_rent(year,'all')
    x = get_years_expense('all',year)
    noi = i - x

    ti = get_tenant_improvements(year)
    
    // parseInt(ti)
    cf = noi - ti 
    
    lc = get_leasing_commissions(year)
    //parseInt(lc)
    cf = cf - lc

    capex = get_capex(year)    
    //parseInt(capex)
    cf = cf - capex

    if ($scope.show_psf == true) {
      return Math.round(cf / sqft * 100) / 100
    } else {
      return cf
    }
  } 

  
}]);







