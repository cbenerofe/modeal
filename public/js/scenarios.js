

var myApp = angular.module('myApp', []);

var api_server = "http://localhost:3050"
//var api_server = "https://modeal-api.herokuapp.com"


buildings = []
spaces = []
leases = []
expenses = []

vacancies = []


retaxes = 0
cam = 0
sqft = 0
mgmt = 0


scenario = undefined

new_leases = {}


start_date = new Date (2017,8,1)
hold_period = 7



myApp.controller('scenarioController', function($scope, $window) {
  
  $scope.years = []

  $scope.buildings = buildings
  $scope.building = undefined

  $scope.leases = leases
  $scope.vacancies = vacancies
  $scope.expenses = expenses

  $scope.scenario = undefined

  $scope.new_leases = {}
  

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
    
    new_leases = []
    $scope.new_leases = []
  }  
  
    
  $scope.init = function() {

    $scope.clear()
     
    year = {}
    $scope.years = []
    year.start_date = new Date(start_date)
    ed = new Date(start_date)
    ed.setFullYear(ed.getFullYear() + 1)
    ed.setDate(ed.getDate() -1)
    year.end_date = ed
    
    $scope.years.push(year)

    for (i=1; i<hold_period;i++) {
      year = {}
      sd = new Date(start_date)
      sd.setFullYear(sd.getFullYear() + i)
      year.start_date = sd
      ed = new Date(sd)
      ed.setFullYear(ed.getFullYear() + 1)
      ed.setDate(ed.getDate() -1)
      year.end_date = ed
      $scope.years.push(year)
    }
    
    
    url = api_server + "/api/scenarios/" + scenarioId + "/newLeases"
    $.ajax({context: this, url: url, 
       success: function(result) { 
         new_leases = result.leases
         $scope.new_leases = new_leases
         $scope.$apply();
       }, 
       error: function(result) {
         alert("error on get new leases")
       }
    });    
    
    
    url = api_server + "/api/scenarios/" + scenarioId
    $.ajax({context: this, url: url, 
       success: function(result) { 
         scenario = result
         $scope.scenario = result         
         load_buildings(scenario.dealId)
       }, 
       error: function(result) {
         console.log("error on scenario")
       }
    });
    
  } 

  $scope.init()

  load_data = function() {
    
    leases = []
    $scope.leases = leases
    
    vacancies = []
    $scope.vacancies = vacancies    
    
    var promises = [];
    
    url = api_server + "/api/buildings/" + $scope.building_id + "/leases"
    //console.log(url)
    promises.push($.ajax({context: this, url: url, 
       success: function(result) { 
         //console.log(JSON.stringify(result))
         leases = result
         $scope.leases = result
         $scope.$apply();
       }, 
       error: function(result) {
         //console.log(JSON.stringify(result));
         //alert("error on leases")
         console.log("error on leases")
       }
    }));
  
    
    retaxes = 0
    cam = 0
    //sqft = 0
    mgmt = 0
    
    expenses = []
    $scope.expenses = expenses
  
  
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

         
       }, 
       error: function(result) {
         console.log("error on expenses")
       }
    }));
    
    $.when.apply($, promises).then(function() {
        
        $scope.$apply();
        
    }, function() {
        // error occurred
    });
    
     
  }

    
  load_buildings = function(dealId) {
    
    buildings = []
    $scope.buildings = buildings
    $scope.building = undefined
    
        
    url = api_server + "/api/deals/" + dealId + "/buildings"
    $.ajax({context: this, url: url, 
       success: function(result) { 
         
         buildings = result
         $scope.buildings = result
         if (result.length > 0) {
           //console.log(JSON.stringify(result))
           $scope.building_id = $scope.buildings[0].id
           $scope.building = $scope.buildings[0]
           sqft = $scope.building.sqft

           load_data()
         }
       }, 
       error: function(result) {
         console.log(JSON.stringify(result));
         //alert("error on buildings")
       }
    });  
  }
  
  
});
