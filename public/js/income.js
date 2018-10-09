


get_years_orig_rent = function(year,charge,psf) {
  if (scenario == undefined ) { return 0 }
  //find all leases
  total = 0
  leases.forEach(function(l) {
    //console.log(JSON.stringify(l.id) + " " + year)
    rent = get_lease_rent(l,year,charge,false,scenario)
    total += rent
  })

  if (psf == true) {
    return Math.round(total / sqft * 100) / 100
  } else {
    return total
  }
}   


get_years_new_rent = function(year,charge,psf) {
  //find all leases
  total = 0
  //console.log(Date.now() + " " + new_leases)
  //Object.keys(new_leases).forEach(function (key) { 
    //if (new_leases[key] != undefined) {
      //console.log(Date.now() + " " + key)
      new_leases.forEach(function(l) {
        if (l != undefined) {
          rent = get_lease_rent(l,year,charge,false)
          total += rent
        }
      })
   // }
  //})

  if (psf == true) {
    return Math.round(total / sqft * 100) / 100
  } else {
    return total
  }
}   


get_years_total_rent = function(year,charge,psf) {
  if (scenario == undefined ) { return 0 }
  //find all leases
  total = 0
  orig = 0
  newbys = 0
  orig = get_years_orig_rent(year,charge,false)
  newbys = get_years_new_rent(year,charge,false)
  total = parseInt(orig) + parseInt(newbys)
  //total = orig
  
  //console.log("sqft=" + sqft + " total=" + total + " psf=" + psf + " =" + Math.round(total/sqft))
  //console.log(year + " orig=" + orig + " newbys=" + newbys + " total=" + total)

  if (psf == true) {
    return Math.round(total / sqft * 100) / 100
  } else {
    return total
  }
}   




get_years_new_sqft = function(year) {
  ret = []
  sqft = 0
  tenants = 0
  new_leases.forEach(function(l) {
    lstart = new Date(l.space['lease-start'])
    if (lstart >= year.start_date && lstart <= year.end_date) {
      tenants ++
      sqft += parseInt(l.space.sqft)
    }
  })
  ret = {'tenants': tenants, 'sqft': sqft}
  return ret
} 


get_new_leases_in_year = function (year) {
  ret = []
  new_leases.forEach(function(l) {
    lstart = new Date(l.space['lease-start'])
    if (lstart >= year.start_date && lstart <= year.end_date) {
      ret.push(l)
    }
  })
  return ret
}


check_lease_start_in_year = function (lease, year) {
  lstart = new Date(lease.space['lease-start'])
  ret = false
  if (lstart >= year.start_date && lstart <= year.end_date) {
      ret = true
  }
  return ret
}



check_lease_in_year = function (lease, year) {
  start = new Date(lease.space['lease-start'])
  ending_period = get_lease_expiration(lease,scenario)
  if (ending_period == undefined) {
    end = new Date(lease.space['lease-end'])
  } else {
    end = new Date(ending_period.end)
  }
  ret = false
  if (start <= year.end_date && end >= year.start_date) {
      ret = true
  }
  return ret
}



get_lease_rent = function(lease,year,charge,psf) {

  // charge = base, retax, cam, mgt,
  if (lease.space == undefined ) {
    return 0
  }
  yearly = 0
  i = 0
  while (i < 12) {
    month = new Date(year.start_date)
    month.setMonth(month.getMonth()+ i)
    monthly = 0;
    if (charge == 'all') {
      monthly += get_charge(lease,month,'base',scenario)
      monthly += get_charge(lease,month,'retax',scenario)
      monthly += get_charge(lease,month,'cam',scenario)
      monthly += get_charge(lease,month,'mgmt',scenario)
    } else {
      monthly += get_charge(lease,month,charge,scenario)
    }
    yearly += monthly
    i++
  }
  if (psf == true) {
    return Math.round(yearly / lease.space.sqft * 100) / 100
  } else {
    return yearly
  }
}   


get_charge = function(lease,month,charge) {
  if (lease.space == undefined) {
    return 0
  }
  dt = Date.now()
  period = undefined
  period = get_lease_period(lease,month)
  if (period == undefined && scenario != undefined) {
    period = get_extension_period(lease,month,scenario)
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
        amount += Math.round(lease.space.sqft * (period.base_rent/12))
      }
      break;
    case 'retax':
      if (period.re_taxes == 'net') {
        //console.log(lease.space.pro_rata * retaxes)
        taxinc = yeardiff * .02 * retaxes
        curtaxes = retaxes + taxinc
        amount += Math.round((lease.space.pro_rata * curtaxes)/12)
      }
      break;
    case 'cam':
      if (period.cam == 'net') {
        caminc = yeardiff * .02 * cam
        curcam = cam + caminc
        amount += Math.round((lease.space.pro_rata * curcam)/12)
      }
      break;
    case 'mgmt':
      if (period.mgmt == 'net') {
        amount += Math.round((lease.space.pro_rata * mgmt)/12)
      }
      break;
  }
  return amount
}



  get_lease_period = function(lease,month,scenario) {
    var period = undefined
    if (lease.space != undefined) {
      var periods = lease.space.periods;
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



  get_extension_period = function(lease,month,scenario) {
    var period = undefined
    if (lease == undefined || lease.space == undefined || scenario == undefined) {
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
          if (se.space_id == lease.space.id) {
            //console.log(se)
            if (lease.space.extensions == undefined ) {
              //console.log ("no extensions:" + space.id)
            } else {
              lease.space.extensions.forEach(function(e) {
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



  get_lease_periods = function(lease,year,scenario) {
  
    var ret = []
    if (lease != undefined && lease.space != undefined) {
      if (lease.space.periods != undefined) {  
        lease.space.periods.forEach(function(p) {
          start = new Date(p.start)
          end = new Date(p.end)
          if (( start <= year.end_date) && ( end >= year.start_date)) {
            ret.push(p)
          }
        })
      }
      if (scenario.extensions != undefined ) {
        scenario.extensions.forEach(function(se) {  
          if (se.space_id == lease.space.id) {
            //console.log(se)
            if (lease.space.extensions == undefined ) {
              //console.log ("no extensions:" + space.id)
            } else {
              lease.space.extensions.forEach(function(e) {
                if (se.extension_id == e.id) {
                  start = new Date(e.start)
                  end = new Date(e.end)
                  if (( start <= year.end_date) && ( end >= year.start_date)) {
                    //console.log(e)
                    ret.push(e)
                  }
                }
              })
            }
          }
        })
      }
    
    
    }

    return ret
  }




  get_lease_expiration = function(lease,scenario) {
    var expiring_period = undefined
    if (lease == undefined || lease.space == undefined) {
      return undefined
    }
      
    latest_period = undefined
    if (lease.space.periods != undefined) {
      // find latest period, 
      // then see if it ends in this month
      latest_end = new Date(2000,01,01)
    
      lease.space.periods.forEach(function(p) {
                
        pieces = p.end.split("/")
        end = new Date(pieces[2],pieces[0],pieces[1])
        //console.log("year="+year + " end=" + end.getFullYear() )
        if (end > latest_end) {
          latest_end = end
          latest_period = p
        }
      })
          
      if (lease.space.extensions != undefined && scenario.extensions != undefined) {
        scenario.extensions.forEach(function(se) {  
          if (se.space_id == lease.space.id) {
            //console.log(se)
        
            lease.space.extensions.forEach(function(e) {
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



  period_months_in_year = function (period,year) {
    // loop through months in period
    // if in year, increase count
    count = 0
    m = 0
    ys = new Date(year.start_date)
    ye = new Date(year.end_date)
    ps = new Date(period.start)
    pe = new Date(period.end)
    while (m < 12) {
      d = new Date(ps)
      d.setMonth(d.getMonth() + m)
    
      if (d <= pe && d >= ys &&  d <= ye) {
        count = count + 1
      } 
      m = m+1
    }
    return count
  }














