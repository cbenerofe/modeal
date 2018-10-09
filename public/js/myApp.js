


var myApp = angular.module('myApp', ['ngRoute']);

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

dealId = undefined
leaseId = undefined
