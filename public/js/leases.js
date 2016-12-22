
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
  
  get_years_rent = function(year,charge,psf,scenario) {
    if (scenario == undefined ) { return 0 }
    //find all leases
    total = 0
    leases.forEach(function(l) {
      //console.log(JSON.stringify(l.id) + " " + year)
      rent = get_tenants_rent(l.id,year,charge,false,scenario)
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
    Object.keys(new_leases).forEach(function (key) { 
      if (new_leases[key] != undefined) {
        new_leases[key].forEach(function(l) {
          //console.log(JSON.stringify(l.id) + " " + year)
          rent = get_new_tenants_rent(l,year,charge,false)
          total += rent
        })
      }
    })

    if (psf == true) {
      return Math.round(total / sqft * 100) / 100
    } else {
      return total
    }
  }   
  
  
  get_years_total_rent = function(year,charge,psf,scenario) {
    if (scenario == undefined ) { return 0 }
    //find all leases
    total = 0
    orig = get_years_rent(year,charge,false,scenario)
    newbys = get_years_new_rent(year,charge,false)
    total = orig + newbys
    //console.log(year + " orig=" + orig + " newbys=" + newbys + " total=" + total)

    if (psf == true) {
      return Math.round(total / sqft * 100) / 100
    } else {
      return total
    }
  }   
  

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


