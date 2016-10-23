
get_years_occupancy = function(year,scenario) {
  //find all leases
  sqft_rented = 0
  leases.forEach(function(l) {
    count = 0
    for (m=1;m<=12;m++) {
      month = new Date(year,m,1)
      p = get_lease_period(l.space,month,scenario)
      if (p == undefined) {
        p = get_extension_period(l.space,month,scenario)
      }
      if (p != undefined) {
        count += 1
      }
    }
    //console.log(JSON.stringify(l.id) + " " + year + " " + count)
    percent = count/12
    sqft_rented += l.space.sqft * percent
  })

  return Math.round(sqft_rented / sqft * 100) / 100

}   


get_years_vacancy = function(year,scenario) {
  //find all leases
  sqft_rented = 0
  leases.forEach(function(l) {
    count = 0
    for (m=1;m<=12;m++) {
      month = new Date(year,m,1)
      p = get_lease_period(l.space,month,scenario)
      if (p == undefined) {
        p = get_extension_period(l.space,month,scenario)
      }
      if (p != undefined) {
        count += 1
      }
    }
    //console.log(JSON.stringify(l.id) + " " + year + " " + count)
    percent = count/12
    sqft_rented += l.space.sqft * percent
  })

  occupancy = sqft_rented / sqft
  vacancy = 1 - occupancy

  return Math.round(vacancy * 100) / 100

}   


check_lease_expiration = function(space,month,scenario) {
  var expiring_period = undefined
  if (space == undefined) {
    return undefined
  }
  
  var periods = space.periods;
  latest_period = undefined
  if (periods != undefined) {
    // find latest period, 
    // then see if it ends in this month
    latest_end = new Date(2000,01,01)
    
    periods.forEach(function(p) {
      pieces = p.end.split("/")
      end = new Date(pieces[2],pieces[0],pieces[1])
      //console.log("year="+year + " end=" + end.getFullYear() )
      if (end > latest_end) {
        latest_end = end
        latest_period = p
      }
    })
  }
  
  //console.log(space.id + " "+ latest_period.end + " " +month.getMonth() +"/" + month.getFullYear())
  if (latest_period != undefined) {
    pieces = latest_period.end.split("/")
    end = new Date(pieces[2],pieces[0],pieces[1])
    if ( month.getFullYear() == end.getFullYear() ) {
      //console.log(space.id + " year="+month.getFullYear() + " eyear=" + end.getFullYear() )
      //console.log(space.id + " month="+month.getMonth() + " emont=" + end.getMonth() )
      if ( month.getMonth() == end.getMonth() ) {
        //console.log("buyah " + space.id + " month="+month.getMonth() + " emont=" + end.getMonth() )
        expiring_period = latest_period
      }
    }
  }

  return expiring_period
}


get_lease_expiration = function(space,scenario) {
  var expiring_period = undefined
  if (space == undefined) {
    return undefined
  }
  
  latest_period = undefined
  if (space.periods != undefined) {
    // find latest period, 
    // then see if it ends in this month
    latest_end = new Date(2000,01,01)
    
    space.periods.forEach(function(p) {
      pieces = p.end.split("/")
      end = new Date(pieces[2],pieces[0],pieces[1])
      //console.log("year="+year + " end=" + end.getFullYear() )
      if (end > latest_end) {
        latest_end = end
        latest_period = p
      }
    })
    
    if (space.extensions != undefined) {
      scenario.extensions.forEach(function(se) {  
        if (se.space_id == space.id) {
          //console.log(se)
        
          space.extensions.forEach(function(e) {
            if (se.extension_id == e.id) {
              //console.log(e)
              pieces = e.end.split("/")
              end = new Date(pieces[2],pieces[0],pieces[1])
              //console.log("year="+year + " end=" + end.getFullYear() )
              if (end > latest_end) {
                latest_end = end
                latest_period = e
              }
            }
          })
        }
      })
    
    }
    
  }
  
  //console.log(space.id + " "+ latest_period.end + " " +month.getMonth() +"/" + month.getFullYear())
  if (latest_period != undefined) {
    pieces = latest_period.end.split("/")
    end = new Date(pieces[2],pieces[0],pieces[1])
    if ( end < end_date ) {
      expiring_period = latest_period
    }
  }

  return expiring_period
}




get_vacant_spaces = function(year,scenario) {
  // loop all leases, and extensions, by month
  // find ones that end that month
  // add to vacancies array, with that month
  v = []
  sqft_rented = 0
  leases.forEach(function(l) {
    count = 0
    for (m=1;m<=12;m++) {
      month = new Date(year,m,1)
      p = check_lease_expiration(l.space,month,scenario)
      if (p != undefined) {
        //console.log(p)
        v.push(p)
      }
    }
  })
  //console.log(v)
  return v.length
}   

get_all_expirations = function(scenario) {
  // loop all leases, find any that expire in range
  // without extension, specify the space and date
  expirations = []
  leases.forEach(function(l) {
    count = 0

    p = get_lease_expiration(l.space,scenario)
    if (p != undefined) {
      //console.log(p)
      v = {}
      v.space_id = l.space.id
      v.sqft = l.space.sqft
      v.pro_rata = l.space.pro_rata
      v.available = p.end
      v.old_tenant = l.tenant
      pieces = p.end.split("/")
      v.month = pieces[0] + "/" + pieces[1]
      expirations.push(v)
    }
    
  })
  //console.log(expirations)
  return expirations
}   


get_expirations = function(year,scenario) {
  // loop all leases, find any that expire in range
  // without extension, specify the space and date
  expirations = []
  leases.forEach(function(l) {
    count = 0
    //console.log(year)
    p = get_lease_expiration(l.space,scenario)
    if (p != undefined) {
      pieces = p.end.split("/")
      end = new Date(pieces[2],pieces[0],pieces[1])
      if (end.getFullYear() == year) {
        v = {}
        v.space_id = l.space.id
        v.sqft = l.space.sqft
        v.pro_rata = l.space.pro_rata
        v.available = p.end
        v.old_tenant = l.tenant
        pieces = p.end.split("/")
        v.month = pieces[0] + "/" + pieces[1]
        expirations.push(v)
      }
    }
    
  })
  //console.log(expirations)
  return expirations
} 

get_new_leases = function(scenario) {
  // for each expiration 
  // create a new lease
  // after waiting period
  new_leases = []
  expirations = get_all_expirations(scenario)
  expirations.forEach(function(e) {
    l = {}
    l.space = {}
    l.space.id = e.space_id
    l.space.pro_rata = e.pro_rata
    l.space.sqft = e.sqft
    p = {}
    pieces = e.available.split("/")
    start = new Date(pieces[2],pieces[0],pieces[1])
    start.setMonth(start.getMonth() + scenario.down_months)
    p.start = start
    end = new Date(pieces[2],pieces[0],pieces[1])
    end.setFullYear(start.getFullYear() + scenario.new_lease.years)
    p.end = end
    p.base_rent = scenario.new_lease.base_rent
    p.re_taxes = scenario.new_lease.re_taxes
    p.cam = scenario.new_lease.cam
    p.mgmt_fee = scenario.new_lease.mgmt_fee
    l.periods = []
    l.periods.push(p)
    new_leases.push(l)
    //console.log(p)
  })
  // console.log(new_leases)
  return new_leases
}
