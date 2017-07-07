

var myApp = angular.module('myApp', []);
//var api_server = "http://localhost:3050"
var api_server = "https://modeal-api.herokuapp.com"


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

new_leases = []


start_date = new Date (2017,8,1)
hold_period = 7



myApp.controller('modealController', function($scope, $window) {
  
  $scope.years = []

  $scope.buildings = buildings
  $scope.building = undefined

  $scope.leases = leases
  $scope.vacancies = vacancies
  $scope.expenses = expenses
  
  $scope.scenarios = scenarios
  $scope.scenario = undefined
  $scope.scenario_id = undefined
  
  $scope.new_leases = []
  

  $scope.show_nets = false
  $scope.toggle_nets = function() {
    $scope.show_nets = !$scope.show_nets
  }
  
  $scope.show_psf = false
  $scope.toggle_psf = function() {
    $scope.show_psf = !$scope.show_psf
  }
  
  
  $scope.colcol = function(index) {
    s = {}
    if (index % 2 && false) {
      s['background-color'] = "white"
    }
    return s
  }


  $scope.$watch('scenario_id', function(newVal,oldVal) {
    //dt = Date.now()
    //console.log (dt  + " oldVal=" + oldVal + " newVal=" + newVal)
    if (newVal && newVal != undefined && newVal != oldVal) {
      //console.log(dt + " here")
     if ($scope.building_id != undefined) {
        $scope.load_scenario()
      }
    }
  });  
    
  $scope.load_scenario = function() {
    //console.log(Date.now() + "loading scenario_id" + $scope.scenario_id)
    new_leases = []
    $scope.new_leases = []
    
    scenario = $scope.scenarios.filter(function(s) { return s.id == $scope.scenario_id; })[0];
    $scope.scenario = scenario
     
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
    
    load_data()
   
  } 

  
  $scope.init = function() {
    
    var promises = [];
    
    scenarios = []
    $scope.scenarios = []

    url = api_server + "/api/deals/" + dealId 
    promises.push($.ajax({context: this, url: url, 
       success: function(result) { 

         $scope.deal = result
         
         $scope.$apply();
       }, 
       error: function(result) {

         console.log("error loading deal")
       }
    }));
    
    url = api_server + "/api/deals/" + dealId + "/scenarios"
    promises.push($.ajax({context: this, url: url, 
       success: function(result) { 

         scenarios = result
         $scope.scenarios = result
         if (result.length > 0) {
           $scope.scenario_id = $scope.scenarios[0].id
         }
         
         $scope.$apply();
       }, 
       error: function(result) {

         console.log("error on scenarios")
       }
    }));
    
    buildings = []
    $scope.buildings = buildings
    $scope.building = undefined    
    
    url = api_server + "/api/deals/" + dealId + "/buildings"
    promises.push($.ajax({context: this, url: url, 
       success: function(result) { 
         
         buildings = result
         $scope.buildings = result
         if (result.length > 0) {
           //console.log(JSON.stringify(result))
           $scope.building_id = $scope.buildings[0].id
           $scope.building = $scope.buildings[0]
           sqft = $scope.building.sqft
         }
       }, 
       error: function(result) {
         //console.log(JSON.stringify(result));
         alert("error on buildings")
       }
    })); 
    
    $.when.apply($, promises).then(function() {
      //console.log("building_id=" + $scope.building_id)
      if ($scope.building_id != undefined) {
        $scope.load_scenario()
      }
    }, function() {
        // error occurred
    });    
    
  }  

  
  $scope.init()


  load_data = function() {
    
    var promises = [];

    url = api_server + "/api/scenarios/" + $scope.scenario_id + "/newLeases"
    promises.push($.ajax({context: this, url: url, 
       success: function(result) { 
         //console.log(JSON.stringify(result.leases))
         new_leases = result.leases
         $scope.new_leases = new_leases
         
       }, 
       error: function(result) {
         //console.log(JSON.stringify(result));
         alert("error on get new leases")
       }
    }));  
    
    url = api_server + "/api/buildings/" + $scope.building_id + "/leases"
    promises.push($.ajax({context: this, url: url, 
       success: function(result) { 
         leases = result
         $scope.leases = result
         
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
    
  
    url = api_server + "/api/buildings/" + $scope.building_id + "/expenses"
    promises.push($.ajax({context: this, url: url, 
       success: function(result) { 

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
    
    
});
