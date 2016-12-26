
get_space_tenants = function(space_id,year,scenario) {
  if (scenario == undefined ) { return 0 }
  // charge = base, retax, cam, mgt,
  //find lease
  //console.log(JSON.stringify(lease_id) + " " + year)
  //console.log(JSON.stringify(leases))
  found_leases = []
  leases.forEach(function(v) { 
    //console.log(space_id + " " + JSON.stringify(v.space))
    return v.space.id === space_id; 
  })[0];
  //console.log(JSON.stringify(lease))
  
  if (lease == undefined ) {
    //console.log("year=" + year + " " + JSON.stringify(new_leases))
    if (new_leases[year] != undefined) {
      lease = new_leases[year].filter(function(v) { 
        //console.log(space_id + " " + JSON.stringify(v.space))
        return v.space.id === space_id; 
      })[0];
    }
  }
  
  if (lease == undefined ) {
    return "";
  }
    
  return lease.tenant
  
}   



get_space_rent = function(space_id,year,charge,psf,scenario) {
  if (scenario == undefined ) { return 0 }
  // charge = base, retax, cam, mgt,
  //find lease
  //console.log(JSON.stringify(lease_id) + " " + year)
  //console.log(JSON.stringify(leases))
  lease = leases.filter(function(v) { 
    //console.log(space_id + " " + JSON.stringify(v.space))
    return v.space.id === space_id; 
  })[0];
  //console.log(JSON.stringify(lease))
  yearly = 0;
  
  if (lease == undefined ) {
    console.log("year=" + year + " " + JSON.stringify(new_leases[year]))
    if (new_leases[year] != undefined) {
      lease = new_leases[year].filter(function(v) { 
        //console.log(space_id + " " + JSON.stringify(v.space))
        return v.space.id === space_id; 
      })[0];
    }
  }
  
  if (lease == undefined ) {
    return 0
  }
  
  for (m=1;m<=12;m++) {
    month = new Date(year,m,1)
    monthly = 0;
    if (charge == 'all') {
      monthly += get_charge(lease.space,month,'base',scenario)
      monthly += get_charge(lease.space,month,'retax',scenario)
      monthly += get_charge(lease.space,month,'cam',scenario)
      monthly += get_charge(lease.space,month,'mgmt',scenario)
    } else {
      monthly += get_charge(lease.space,month,charge,scenario)
    }
    yearly += monthly
  }

  if (psf == true) {
    return Math.round(yearly / lease.space.sqft * 100) / 100
  } else {
    return yearly
  }
  
}   




  get_lease_period = function(space,month,scenario) {
    var period = undefined
    if (space != undefined) {
      var periods = space.periods;
      if (periods != undefined) {  
        periods.forEach(function(p) {
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
      }
    }
    return period
  }

  get_extension_period = function(space,month,scenario) {
    var period = undefined
    if (space == undefined || scenario == undefined) {
      //console.log("space=" + space.id + " scenario=" + scenario)
    } else {
      //console.log("space=" + space.id + "scenario=" + scenario)
      var periods = []
      // loop through scenarios
      // find ones for this lease_id and space_id
      // then loop through extensions
      // assemble those relevant periods
      if (scenario.extensions != undefined ) {
        scenario.extensions.forEach(function(se) {  
          if (se.space_id == space.id) {
            //console.log(se)
            space.extensions.forEach(function(e) {
              if (se.extension_id == e.id) {
                //console.log(e)
                periods.push(e)
              }
            })
          }
        })
      }
      
      periods.forEach(function(p) {
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
      
    } 
    return period
  }


  get_charge = function(space,month,charge,scenario=undefined) {
    
    if (space == undefined) {
      return 0
    }
    
    period = get_lease_period(space,month)
    if (period == undefined && scenario != undefined) {
      period = get_extension_period(space,month,scenario)
    }
    if (period == undefined) {
      return 0
    }
    amount = 0
    yeardiff = month.getFullYear() - start_date.getFullYear()
    
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
          taxinc = yeardiff * .02 * retaxes
          
          curtaxes = retaxes + taxinc
          //console.log(month.getFullYear() + " " + curtaxes)
          amount += Math.round((space.pro_rata * curtaxes)/12)
                    
        }
        break;
      case 'cam':
        if (period.cam == 'net') {
          caminc = yeardiff * .02 * cam
          curcam = cam + caminc
          amount += Math.round((space.pro_rata * curcam)/12)
        }
        break;
      case 'mgmt':
        if (period.mgmt == 'net') {
          amount += Math.round((space.pro_rata * mgmt)/12)
        }
        break;
    }
    return amount
  }


  get_tenants_rent = function(lease_id,year,charge,psf,scenario) {
    if (scenario == undefined ) { return 0 }
    // charge = base, retax, cam, mgt,
    //find lease
    //console.log(JSON.stringify(lease_id) + " " + year)
    lease = leases.filter(function(v) { return v.id === lease_id; })[0];
    //console.log(JSON.stringify(lease))
    yearly = 0;
    
    for (m=1;m<=12;m++) {
      month = new Date(year,m,1)
      monthly = 0;
      if (charge == 'all') {
        monthly += get_charge(lease.space,month,'base',scenario)
        monthly += get_charge(lease.space,month,'retax',scenario)
        monthly += get_charge(lease.space,month,'cam',scenario)
        monthly += get_charge(lease.space,month,'mgmt',scenario)
      } else {
        monthly += get_charge(lease.space,month,charge,scenario)
      }
      yearly += monthly
    }
    
    if (psf == true) {
      return Math.round(yearly / lease.space.sqft * 100) / 100
    } else {
      return yearly
    }
  }   
  

  get_new_tenants_rent = function(lease,year,charge,psf) {
    // charge = base, retax, cam, mgt,
    //find lease
    //console.log(JSON.stringify(lease_id) + " " + year)
    yearly = 0;
    
    for (m=1;m<=12;m++) {
      month = new Date(year,m,1)
      monthly = 0;
      if (charge == 'all') {
        monthly += get_charge(lease.space,month,'base')
        monthly += get_charge(lease.space,month,'retax')
        monthly += get_charge(lease.space,month,'cam')
        monthly += get_charge(lease.space,month,'mgmt')
      } else {
        monthly += get_charge(lease.space,month,charge)
      }
      yearly += monthly
    }
    
    //console.log("lease=" + JSON.stringify(lease) + " year=" + year + " charge=" + charge + " yearly=" + yearly)
    
    
    if (psf == true) {
      return Math.round(yearly / lease.space.sqft * 100) / 100
    } else {
      return yearly
    }
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


