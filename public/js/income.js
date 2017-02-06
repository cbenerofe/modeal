


get_years_orig_rent = function(year,charge,psf) {
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


get_years_total_rent = function(year,charge,psf) {
  if (scenario == undefined ) { return 0 }
  //find all leases
  total = 0
  orig = get_years_orig_rent(year,charge,psf)
  newbys = get_years_new_rent(year,charge,psf)
  total = orig + newbys
  //console.log(year + " orig=" + orig + " newbys=" + newbys + " total=" + total)

  if (psf == true) {
    return Math.round(total / sqft * 100) / 100
  } else {
    return total
  }
}   

get_years_rent = function(year,charge,psf) {
  if (scenario == undefined ) { return 0 }
  //loop through all spaces
  total = 0
  spaces.forEach(function(s) {
    get_space_leases(s.id,year).forEach(function(l) {
      total += get_lease_rent(l,year,charge,false)
    })
  })

  if (psf == true) {
    return Math.round(total / sqft * 100) / 100
  } else {
    return total
  }
}   



myApp.controller('incomeController', ['$scope',function($scope) {
  
  
  $scope.get_space_leases = function(space_id, year) {
    x = get_space_leases(space_id,year)
    return x
  } 
  
  $scope.get_lease_rent = function(lease, year,charge) {
    x = get_lease_rent(lease,year,charge,$scope.show_psf)
    return x
  } 
  
  $scope.get_years_rent = function(year,charge) {
    x = get_years_rent(year,charge,$scope.show_psf)
    return x
  } 
  
}]);







