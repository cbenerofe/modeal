   

  get_tenant_improvements = function(year) {
    //find all leases
    total = 0
    Object.keys(new_leases).forEach(function (key) { 
      if (new_leases[key] != undefined) {
        new_leases[key].forEach(function(l) {
          //console.log(JSON.stringify(l.id) + " " + year)
          if (l.space.periods[0].start_date.getFullYear() == year) {
            total += l.ti
          }
        })
      }
    })
    return parseInt(total)
  }   
  
  get_leasing_commissions = function(year) {
    //find all leases
    total = 0
    Object.keys(new_leases).forEach(function (key) { 
      if (new_leases[key] != undefined) {
        new_leases[key].forEach(function(l) {
          //console.log(JSON.stringify(l.id) + " " + year)
          if (l.space.periods[0].start_date.getFullYear() == year) {
            total += l.lc
          }
        })
      }
    })
    return parseInt(total)
  }  

  get_capex = function(year,scenario) {
    if (scenario == undefined ) { return 0 }
    //find all leases
    total = 0
    if (scenario.capex != undefined) {
      total = scenario.capex
    }
    return total
  }  
 


