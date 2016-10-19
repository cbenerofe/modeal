

var myApp = angular.module('myApp', []);

myApp.controller('myController', ['$scope',function($scope) {
  
  var start_date = new Date (2017,1,1)
  var hold_period = 5
  $scope.years = []
  retaxes = 633873
  cam = 188802
  
  $scope.leases = lease_data;
  
  get_period = function(periods,month) {
    var period = {}
    periods.forEach(function(p) {
      month
      pieces = p.start.split("/")
      start = new Date(pieces[2],pieces[0],pieces[1])
      //console.log("p="+JSON.stringify(p))
      pieces = p.end.split("/")
      end = new Date(pieces[2],pieces[0],pieces[1])
      //console.log("year="+year + " start=" + start.getFullYear() + " end=" + end.getFullYear() )
      if (( month >= start) && ( month <= end)) {
        period = p
      }
    })
    return period
  }

  get_charge = function(space,periods,month,charge) {
    
    if (periods == undefined){
      return 0
    }
    
    period = get_period(periods,month)
    amount = 0
    switch (charge) {
      case 'base':
        //console.log(period.base_rent)
        if (period.base_rent != undefined) {
          //console.log(period.base_rent)
          amount += Math.round(space.sqft * (period.base_rent/12))
        }
        break;
      case 'retax':
        if (period.re_taxes == 'net') {
          //console.log(lease.space.pro_rata * retaxes)
          amount += Math.round((space.pro_rata * retaxes)/12)
        }
        break;
      case 'cam':
        if (period.cam == 'net') {
          amount += Math.round((space.pro_rata * cam)/12)
        }
        break;
    }
    return amount
  }

  $scope.get_tenants_rent = function(lease_id,year,charge) {
    // charge = base, retax, cam, mgt,
    //find lease
    //console.log(JSON.stringify(lease_id) + " " + year)
    lease = $scope.leases.filter(function(v) { return v.id === lease_id; })[0];
    //console.log(JSON.stringify(lease))
    yearly = 0;
    
    for (m=1;m<=12;m++) {
      month = new Date(year,m,1)
      monthly = 0;
      monthly += get_charge(lease.space,lease.space.periods,month,charge)
      monthly += get_charge(lease.space,lease.space.extensions,month,charge)
      yearly += monthly
    }
    
    return yearly
    //console.log(JSON.stringify(period))
  }   
  
  
  
  
  $scope.get_years_rent = function(year,charge) {
    //find all leases
    total = 0
    $scope.leases.forEach(function(l) {
      //console.log(JSON.stringify(l.id) + " " + year)
      rent = $scope.get_tenants_rent(l.id,year.getFullYear(),charge)
      total += rent
    })

    return total
    //console.log(JSON.stringify(period))
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





