


get_years_rent = function(year,charge,psf,scenario) {
  if (scenario == undefined ) { return 0 }
  //find all leases
  total = 0
  leases.forEach(function(l) {
    //console.log(JSON.stringify(l.id) + " " + year)
    rent = get_tenants_rent(l.id,year,charge,false,scenario)
    total += rent
  })

  if (psf == true) {
    return Math.round(total / sqft * 100) / 100
  } else {
    return total
  }
}   


get_years_new_rent = function(year,charge,psf) {
  //find all leases
  total = 0
  Object.keys(new_leases).forEach(function (key) { 
    if (new_leases[key] != undefined) {
      new_leases[key].forEach(function(l) {
        //console.log(JSON.stringify(l.id) + " " + year)
        rent = get_new_tenants_rent(l,year,charge,false)
        total += rent
      })
    }
  })

  if (psf == true) {
    return Math.round(total / sqft * 100) / 100
  } else {
    return total
  }
}   


get_years_total_rent = function(year,charge,psf,scenario) {
  if (scenario == undefined ) { return 0 }
  //find all leases
  total = 0
  orig = get_years_rent(year,charge,false,scenario)
  newbys = get_years_new_rent(year,charge,false)
  total = orig + newbys
  //console.log(year + " orig=" + orig + " newbys=" + newbys + " total=" + total)

  if (psf == true) {
    return Math.round(total / sqft * 100) / 100
  } else {
    return total
  }
}   





myApp.controller('incomeController', ['$scope',function($scope) {
  
  $scope.get_space_rent = function(space_id, year, charge) {
    x = get_space_rent(space_id,year,charge,$scope.show_psf, $scope.scenario_id)
    return x
  }  
  
  $scope.get_space_tenant = function(space_id, year) {
    x = get_space_tenant(space_id,year,$scope.scenario_id)
    return x
  }    
  
}]);







