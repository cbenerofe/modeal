

var myApp = angular.module('myApp', []);
//var api_server = "http://localhost:3050"
var api_server = "https://modeal-api.herokuapp.com"

deals = []
buildings = []
spaces = []
leases = []
expenses = []
scenarios = []
vacancies = []


retaxes = 0
cam = 0
sqft = 0
mgmt = 0


scenario = undefined

expirations = {}
new_leases = {}


start_date = new Date (2017,1,1)
hold_period = 7



myApp.controller('modealController', function($scope, $window) {
  
  $scope.years = []
  $scope.deals = deals
  $scope.deal = undefined
  $scope.buildings = buildings
  $scope.building = undefined
  $scope.spaces = spaces
  $scope.leases = leases
  $scope.vacancies = vacancies
  $scope.expenses = expenses
  $scope.scenarios = scenarios
  $scope.scenario = undefined
  $scope.scenario_id = undefined
  $scope.expirations = {}
  $scope.new_leases = {}
  
  $scope.$watch('deal_id', function() {
    if ($scope.deal_id != undefined) {
      $scope.clear()
      load_buildings()
    }
  });
  
  $scope.$watch('scenario_id', function() {
    if ($scope.scenario_id != undefined) {
      //console.log(Date.now())
      $scope.init()
    }
  });

  $scope.show_nets = false
  $scope.toggle_nets = function() {
    $scope.show_nets = !$scope.show_nets
  }
  
  $scope.show_psf = false
  $scope.toggle_psf = function() {
    $scope.show_psf = !$scope.show_psf
  }
  
  $scope.show_tenants = false
  $scope.toggle_tenants = function() {
    $scope.show_tenants = !$scope.show_tenants
  }
  
  $scope.colcol = function(index) {
    s = {}
    if (index % 2 && false) {
      s['background-color'] = "white"
    }
    return s
  }
    
  $scope.clear = function() {
    
    Object.keys(expirations).forEach(function (prop) {
      delete expirations[prop];
    });

    Object.keys($scope.expirations).forEach(function (prop) {
      delete $scope.expirations[prop];
    });    
    
    Object.keys(new_leases).forEach(function (prop) {
      delete new_leases[prop];
    });

    Object.keys($scope.new_leases).forEach(function (prop) {
      delete $scope.new_leases[prop];
    });
  
  }  
    
  $scope.init = function() {
    //console.log(Date.now())
    $scope.clear()
    
    scenario = $scope.scenarios.filter(function(s) { return s.id == $scope.scenario_id; })[0];
    $scope.scenario = scenario
    
    deal = $scope.deals.filter(function(d) { return d.id == $scope.deal_id; })[0];
    $scope.deal = deal
     
    year = {}
    $scope.years = []
    year.start_date = new Date(start_date)
    ed = new Date(start_date)
    ed.setFullYear(ed.getFullYear() + 1)
    ed.setDate(ed.getDate() -1)
    year.end_date = ed
    
    $scope.years.push(year)

    $scope.expirations[year.start_date.getFullYear()] = get_expirations(year.start_date.getFullYear(),$scope.scenario)
    $scope.expirations[year.start_date.getFullYear()] = $scope.expirations[year.start_date.getFullYear()].concat(vacancies)

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
    
    //console.log("leases:" + JSON.stringify(leases))
    //console.log("new_leases:" + JSON.stringify(new_leases))
    
  } 
  
  //$scope.init()    
  
  load_deals = function() {
    
    url = api_server + "/api/deals"
    $.ajax({context: this, url: url, 
       success: function(result) { 
         //console.log(JSON.stringify(result))
         deals = result
         $scope.deals = result
         $scope.deal_id = $scope.deals[0].id
         $scope.$apply();
         load_buildings()
       }, 
       error: function(result) {
         //console.log(JSON.stringify(result));
         alert("error on deals")
       }
    });
     
  }
  
  load_scenarios = function() {
    scenarios = []
    $scope.scenarios = []
    
    url = api_server + "/api/deals/" + $scope.deal_id + "/scenarios"
    $.ajax({context: this, url: url, 
       success: function(result) { 
         //console.log(JSON.stringify(result))
         scenarios = result
         $scope.scenarios = result
         //console.log(JSON.stringify($scope.leases))
         //alert("hey")
         //$scope.scenario = $scope.scenarios.filter(function(s) { return s.id == $scope.scenario_id; })[0];
         if (result.length > 0) {
           $scope.scenario_id = $scope.scenarios[0].id
         }
         $scope.$apply();
        // $scope.init();
       }, 
       error: function(result) {
         //console.log(JSON.stringify(result));
         //alert("error on scenarios")
         console.log("error on scenarios")
       }
    });
  }  


  load_data = function() {
    
    var promises = [];
    
    url = api_server + "/api/buildings/" + $scope.building_id + "/leases"
    //console.log(url)
    promises.push($.ajax({context: this, url: url, 
       success: function(result) { 
         //console.log(JSON.stringify(result))
         leases = result
         $scope.leases = result
         leases.forEach(function(element) {
           spaces.push(element.space)
           //console.log(element.space);
           });
         $scope.spaces = spaces;
         //console.log(JSON.stringify($scope.leases))
         //alert("hey")
         $scope.$apply();
       }, 
       error: function(result) {
         //console.log(JSON.stringify(result));
         //alert("error on leases")
         console.log("error on leases")
       }
    }));
  
    url = api_server + "/api/buildings/" + $scope.building_id + "/expenses"
    promises.push($.ajax({context: this, url: url, 
       success: function(result) { 
         //console.log(JSON.stringify(result))
         expenses = result
         $scope.expenses = result
          y = start_date.getFullYear()
         
         expenses.forEach(function(e) {
            if (e.chargeback == 'retax') {
              c = e.estimates.filter(function(s) { return s.year == y; })[0];
              if (c != undefined) {
                retaxes = retaxes + c.amount
              }
            }
            if (e.chargeback == 'cam') {
              c = e.estimates.filter(function(s) { return s.year == y; })[0];
              if (c != undefined) {
                cam = cam + c.amount
              }
            }
            if (e.chargeback == 'mgmt') {
              c = e.estimates.filter(function(s) { return s.year == y; })[0];
              if (c != undefined) {
                mgmt = mgmt + c.amount
              }
            }
         });
         //console.log("retaxes=" + retaxes + " cam=" + cam + " mgmt=" + mgmt)
         //alert("hey")
         $scope.$apply();
       }, 
       error: function(result) {
         //console.log(JSON.stringify(result));
         //alert("error on expenses")
         console.log("error on expenses")
       }
    }));
    
    $.when.apply($, promises).then(function() {
        // returned data is in arguments[0][0], arguments[1][0], ... arguments[9][0]
        // you can process it here
       //$scope.init()
      load_scenarios()
    }, function() {
        // error occurred
    });
    
     
  }

    
  load_buildings = function() {
    
    buildings = []
    spaces = []
    leases = []
    expenses = []
    scenarios = []
    vacancies = []
    $scope.years = []
    $scope.buildings = buildings
    $scope.building = undefined
    $scope.spaces = spaces
    $scope.leases = leases
    $scope.vacancies = vacancies
    $scope.expenses = expenses
    $scope.scenarios = scenarios
    $scope.scenario = undefined    
    
    
    url = api_server + "/api/deals/" + $scope.deal_id + "/buildings"
    $.ajax({context: this, url: url, 
       success: function(result) { 
         
         buildings = result
         $scope.buildings = result
         if (result.length > 0) {
           //console.log(JSON.stringify(result))
           $scope.building_id = $scope.buildings[0].id
           $scope.building = $scope.buildings[0]
           sqft = $scope.building.sqft
           $scope.$apply();
           load_data()
         }
       }, 
       error: function(result) {
         console.log(JSON.stringify(result));
         //alert("error on buildings")
       }
    });  
  }
    

  
  load_deals();
    
    
});
