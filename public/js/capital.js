   

  get_tenant_improvements = function(year) {
    //find all leases
    total = 0
    //Object.keys(new_leases).forEach(function (key) { 
    //  if (new_leases[key] != undefined) {
        new_leases.forEach(function(l) {
          //console.log(JSON.stringify(l.id) + " " + year)
          pieces = l.space.periods[0].start.split("/")
          start = new Date(pieces[2],pieces[0],pieces[1])
          
          if (start >= year.start_date && start <= year.end_date) {
            total += l.space.ti
          }
        })
    //  }
    //})
    return parseInt(total)
  }   
  
  get_leasing_commissions = function(year) {
    //find all leases
    total = 0
    //Object.keys(new_leases).forEach(function (key) { 
      //if (new_leases[key] != undefined) {
        new_leases.forEach(function(l) {
          //console.log(JSON.stringify(l.space.periods[0]))
          pieces = l.space.periods[0].start.split("/")
          start = new Date(pieces[2],pieces[0],pieces[1])
          if (start >= year.start_date && start <= year.end_date) {
            total += l.space.lc
          }
        })
    //  }
    //})
    return parseInt(total)
  }  

  get_capex = function(year,psf) {
    if (scenario == undefined ) { return 0 }
    //find all leases
    total = 0
    if (scenario.capex != undefined) {
      total = scenario.capex
    }

    if (psf == true) {
      return Math.round(total / sqft * 100) / 100
    } else {
      return total
    }
  }  
 


