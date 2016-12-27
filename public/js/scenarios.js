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

get_new_leases = function(scenario) {
  // for each expiration 
  // create a new lease
  // after waiting period
  new_leases = {}
  expirations = get_all_expirations(scenario)
  expirations.forEach(function(e) {
    //console.log("exp=" + JSON.stringify(e))
    l = {}
    l.tenant = "new-" + e.space_id
    l.space = {}
    l.space.id = e.space_id
    l.space.pro_rata = e.pro_rata
    l.space.sqft = e.sqft

    pieces = e.available.split("/")
    //console.log(pieces)
    start = new Date(parseInt(pieces[2]),parseInt(pieces[0]),parseInt(pieces[1]))
    start.setMonth(start.getMonth() + parseInt(scenario.down_months) -1)
    l.space['lease-start'] = start.getMonth() + "/" + start.getDate() + "/" + start.getFullYear()
    
    end = new Date(start.valueOf())
    end.setFullYear(end.getFullYear() + parseInt(scenario.new_lease.years))
    l.space['lease-end'] = end.getMonth() + "/" + end.getDate() + "/" + end.getFullYear()
    
    p = {}
    //p.start_date = start
    p.start = start.getMonth() + "/" + start.getDate() + "/" + start.getFullYear()

    //p.end_date = end
    p.end = end.getMonth() + "/" + end.getDate() + "/" + end.getFullYear()
  
    diff = start.getFullYear() - 2017
    increase = diff * .035 * scenario.new_lease.base_rent
  
    p.base_rent = parseInt(scenario.new_lease.base_rent) + increase
    //console.log("diff=" + diff + " increase=" + increase + " new_rent=" + p.base_rent)
    p.re_taxes = scenario.new_lease.re_taxes
    p.cam = scenario.new_lease.cam
    p.mgmt_fee = scenario.new_lease.mgmt_fee
    l.space.periods = []
    l.space.periods.push(p)
    if (new_leases[start.getFullYear()] == undefined) {
      new_leases[start.getFullYear()] =[]
    }
    l.space.ti = scenario.new_lease.ti_psf * e.sqft
    l.space.lc = Math.round(scenario.new_lease.commision * e.sqft * scenario.new_lease.base_rent * scenario.new_lease.years)
    //console.log("newl=" + JSON.stringify(l))
    new_leases[start.getFullYear()].push(l)
    //console.log(l)
  })
  // console.log(new_leases)
  return new_leases
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
