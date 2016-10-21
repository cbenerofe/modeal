
  get_lease_period = function(periods,month) {
    var period = {}
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
    return period
  }

  get_charge = function(space,periods,month,charge) {
    
    if (periods == undefined){
      return 0
    }
    
    period = get_lease_period(periods,month)
    amount = 0
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
          amount += Math.round((space.pro_rata * retaxes)/12)
        }
        break;
      case 'cam':
        if (period.cam == 'net') {
          amount += Math.round((space.pro_rata * cam)/12)
        }
        break;
    }
    return amount
  }

  get_tenants_rent = function(lease_id,year,charge) {
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
        monthly += get_charge(lease.space,lease.space.periods,month,'base')
        monthly += get_charge(lease.space,lease.space.periods,month,'retax')
        monthly += get_charge(lease.space,lease.space.periods,month,'cam')
        monthly += get_charge(lease.space,lease.space.extensions,month,'base')
        monthly += get_charge(lease.space,lease.space.extensions,month,'retax')
        monthly += get_charge(lease.space,lease.space.extensions,month,'cam')
      } else {
        monthly += get_charge(lease.space,lease.space.periods,month,charge)
        monthly += get_charge(lease.space,lease.space.extensions,month,charge)
      }
      yearly += monthly
    }
    
    return yearly
    //console.log(JSON.stringify(period))
  }   
  
  get_years_rent = function(year,charge) {
    //find all leases
    total = 0
    leases.forEach(function(l) {
      //console.log(JSON.stringify(l.id) + " " + year)
      rent = get_tenants_rent(l.id,year.getFullYear(),charge)
      total += rent
    })

    return total
    //console.log(JSON.stringify(period))
  }   
  
  






