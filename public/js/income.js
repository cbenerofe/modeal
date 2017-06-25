


get_years_orig_rent = function(year,charge,psf) {
  if (scenario == undefined ) { return 0 }
  //find all leases
  total = 0
  leases.forEach(function(l) {
    //console.log(JSON.stringify(l.id) + " " + year)
    rent = get_space_rent(l.space,year,charge,false,scenario)
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
          rent = get_space_rent(l.space,year,charge,false)
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













