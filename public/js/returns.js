

myApp.controller('returnsController', ['$scope',function($scope) {
    
  
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







