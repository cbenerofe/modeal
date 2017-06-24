
get_space_leases = function(space_id,year) {  
  // find original leases for the space active during the year
  // find new leases for the space active during the year
  //console.log("get space leases: " + space_id)
  
  found_leases = []
  leases.forEach(function(l) { 
    if (l.space.id == space_id) {
      if (check_lease_in_year(l,year) == true ) {
        found_leases.push(l)
      }
    }
  });
  
  Object.keys(new_leases).forEach(function (key) { 
    if (new_leases[key] != undefined) {
      new_leases[key].forEach(function(l) {
        //console.log("checking: " + JSON.stringify(l))
        if (l.space.id == space_id) {
          if (check_lease_in_year(l,year) == true ) {
            found_leases.push(l)
          }
        }
      })
    }
  })

  return found_leases
  
}   



get_lease_rent = function(lease,year,charge,psf) {

  // charge = base, retax, cam, mgt,
  
  if (lease == undefined ) {
    return 0
  }
  yearly = 0
  
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

  get_extension_period = function(space,month) {
    var period = undefined
    if (space == undefined || scenario == undefined) {
      //console.log("space=" + space.id + " scenario=" + scenario)
    } else {
      dt = Date.now()
      //console.log(dt + " space=" + space.id )
      var periods = []
      // loop through scenarios
      // find ones for this lease_id and space_id
      // then loop through extensions
      // assemble those relevant periods
      if (scenario.extensions != undefined ) {
        scenario.extensions.forEach(function(se) {  
          if (se.space_id == space.id) {
            //console.log(se)
            if (space.extensions == undefined ) {
              //console.log ("no extensions:" + space.id)
            } else {
              space.extensions.forEach(function(e) {
                if (se.extension_id == e.id) {
                  //console.log(e)
                  periods.push(e)
                }
              })
            }
          }
        })
      }
      
      //console.log(dt + "here")
      if (periods == undefined) {
        console.log("here" + space)
      } else {
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


  get_charge = function(space,month,charge) {
    
    if (space == undefined) {
      return 0
    }

    dt = Date.now()
    period = undefined
    period = get_lease_period(space,month)
    if (period == undefined && scenario != undefined) {
      period = get_extension_period(space,month)
      
      if (space.id == "225-108" && month.getFullYear() == '2018' && month.getMonth() == 2) {
        if (period == undefined) {
        //  console.log(space)
        } else {
      //    console.log(dt + " period= " + JSON.stringify(period))
        }
      }
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
          amount += Math.round((space.pro_rata * curtaxes)/12)
          //if (space.id == "102" ) {
          //  console.log("taxinc=" + taxinc + "retaxes=" + retaxes  + " curtaxes=" + curtaxes + " space_pro_rata= " + space.pro_rata + " amount=" + amount )
            //}
          
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
    if (space.id == "225-108" && month.getFullYear() == '2018' && month.getMonth() == 2) {
     // console.log(dt + " charge=" + charge + " amount= " + amount)
    }
    return amount
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
    
    return latest_period
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

  check_lease_in_year = function (lease, year) {
    start = new Date(lease.space['lease-start'])
    ending_period = get_lease_expiration(lease.space,scenario)
    if (ending_period == undefined) {
      end = new Date(lease.space['lease-end'])
    } else {
      end = new Date(ending_period.end)
    }
    
    ret = false
    if (start.getFullYear() <= year) {
      if (end.getFullYear() >= year) {
        ret = true
      }
    }
    if (lease.space.id == '225-106') {
      //console.log(Date.now() + " year=" + year + " start=" + start.getFullYear() + " end=" + end.getFullYear() + " ret=" + ret)
    }
    return ret
  }

