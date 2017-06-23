get_all_expirations = function(scenario) {
  // loop all leases, find any that expire in range
  // without extension, specify the space and date
  expirations = vacancies
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

  //console.log(JSON.stringify(expirations))
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
        v.available = end
        v.old_tenant = l.tenant
        //pieces = p.end.split("/")
        //v.month = pieces[0] + "/" + pieces[1]
        expirations.push(v)
      }
    }
  
  })

  //console.log(JSON.stringify(expirations))
  return expirations
} 

get_newlease_expirations = function(nleases,scenario) {
  // loop all leases, find any that expire in range
  // without extension, specify the space and date
  new_expirations = []

  Object.keys(nleases).forEach(function(x) {
    nl = nleases[x]
    nl.forEach(function(l) {
    
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
        
        new_expirations.push(v)
      }
    })
  
  })

  //console.log(JSON.stringify(expirations))
  return new_expirations
}   




create_new_lease = function(e, scenario) {
  
    //console.log("exp=" + JSON.stringify(e))
    l = {}
    l.tenant = "new-" + e.space_id
    l.space = {}
    l.space.id = e.space_id
    l.space.pro_rata = e.pro_rata
    l.space.sqft = e.sqft
    l.space.periods = []
    l.space.extensions = []
    
    pieces = e.available.split("/")
    
    start = new Date(parseInt(pieces[2]),parseInt(pieces[0]),parseInt(pieces[1]))
    start.setMonth(start.getMonth() + parseInt(scenario.down_months) -1)
    l.space['lease-start'] = start.getMonth() + "/" + start.getDate() + "/" + start.getFullYear()
    
    end = new Date(start.valueOf())
    end.setFullYear(end.getFullYear() + parseInt(scenario.new_lease.years))
    
    l.space['lease-end'] = end.getMonth() + "/" + end.getDate() + "/" + end.getFullYear()
    
    for (z=0; z< parseInt(scenario.new_lease.years); z++) {
      p = {}
      //p.start_date = start
      m = start.getMonth() + 1
      p.start =  m + "/" + start.getDate() + "/" + start.getFullYear()

      end = new Date(start.valueOf())
      end.setFullYear(end.getFullYear() + 1)
      m = end.getMonth() + 1
      p.end =  m + "/" + end.getDate() + "/" + end.getFullYear()
  
      diff = start.getFullYear() - 2017
  
      p.base_rent = calc_increase(parseFloat(scenario.new_lease.base_rent),diff,parseFloat(scenario.new_lease.increases))
      //console.log("diff=" + diff + " increase=" + increase + " new_rent=" + p.base_rent)
      p.re_taxes = scenario.new_lease.re_taxes
      p.cam = scenario.new_lease.cam
      p.mgmt_fee = scenario.new_lease.mgmt

      l.space.periods.push(p)
      start = new Date(start.valueOf())
      start.setFullYear(start.getFullYear() + 1)
    }
    

    l.space.ti = scenario.new_lease.ti_psf * e.sqft
    l.space.lc = Math.round(scenario.new_lease.commision * e.sqft * scenario.new_lease.base_rent * scenario.new_lease.years)
    //console.log("newl=" + JSON.stringify(l))
  return l
}

get_new_leases = function(scenario) {
  // for each expiration 
  // create a new lease
  // after waiting period
 // console.log("get new leases: " + Date.now())
  new_leases = {}
  expirations = get_all_expirations(scenario)
  expirations.forEach(function(e) {
    //console.log("exp=" + JSON.stringify(e))
    l = create_new_lease(e,scenario)
    //console.log("new lease: " + JSON.stringify(l))
 
    //console.log("new lease: " + l.tenant  + " " + l.space['lease-start'] + " - " + l.space['lease-end'])
    s = new Date(l.space['lease-start'])
    //console.log(s.getFullYear())
 
    if (new_leases[s] == undefined) {
      new_leases[s] =[]
    }
    new_leases[s].push(l)    
    
    //console.log(l)
  })
  
  new_expirations = get_newlease_expirations(new_leases,scenario)
  new_expirations.forEach(function(ne) {
    //console.log("new exp=" + JSON.stringify(ne))
    
    l = create_new_lease(ne,scenario)

    s = new Date(l.space['lease-start'])
    //console.log(s.getFullYear())
 
    if (new_leases[s] == undefined) {
      new_leases[s] =[]
    }
    new_leases[s].push(l)    
    
    //console.log(l)
  })  
  
  
  // console.log(new_leases)
  return new_leases
}


calc_increase = function(base,years,rate) {
  x = base
  for (i=0; i<=years; i++) {
    //console.log(i+ " " + x)
    x = x + x*rate
  }
  return x
}


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

  Object.keys(new_leases).forEach(function (key) { 
    if (new_leases[key] != undefined) {
      new_leases[key].forEach(function(l) {
        //console.log(JSON.stringify(l.id) + " " + year)
        count = 0
        for (m=1;m<=12;m++) {
          month = new Date(year,m,1)
          p = l.space.periods[0]
          if (p != undefined) {
            if (p.start_date <= month && p.end_date >= month)
            count += 1
          }
        }
        //console.log(JSON.stringify(l.id) + " " + year + " " + count)
        percent = count/12
        sqft_rented += l.space.sqft * percent
      })
    }
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
