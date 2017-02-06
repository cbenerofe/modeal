

myApp.controller('cashflowController', ['$scope',function($scope) {
  
  
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
    x = get_years_total_rent(year,charge,$scope.show_psf)
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

    ti = get_tenant_improvements(year,$scope.scenario)
    
    x = parseInt(ti)
    
    lc = get_leasing_commissions(year,$scope.scenario)
    x += parseInt(lc)

    capex = get_capex(year,$scope.scenario)    
    x += parseInt(capex)
    
    cash_flow = parseInt(i) - parseInt(x)

    if (psf == true) {
      return Math.round(cash_flow / sqft * 100) / 100
    } else {
      return cash_flow
    }
  } 


  
}]);







