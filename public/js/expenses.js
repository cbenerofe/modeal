

  get_expense_period = function(periods,year) {
    var period = undefined
    latest_year = 0;
    periods.forEach(function(p) {
      if (p.year == year) {
        period = p
      }
    })
    return period
  }

  get_latest_expense_period = function(periods,year) {
    var period = undefined
    latest_year = 0;
    periods.forEach(function(p) {
      if (p.year > latest_year) { 
        period = p 
      }
      if (p.year == year) {
        return p
      }
    })
    return period
  }


  get_years_expense = function(expense_id,year,psf=false) {
    // if in the past, check for actual 
    //  if can't find, worry about later...

    // if in the future, check for estimate
    // if can't find, check for latest actual

    amount = 0
    years = year.toString()

    if (expense_id == 'all') {
      //console.log("year: " + year)
      expenses.forEach(function(e) {
        tmp = 0
        period = get_expense_period(e.estimates,year)
        //console.log("estimate:" + JSON.stringify(period))
        if (period != undefined ) {
          tmp = period.amount
        } else {
          period = get_latest_expense_period(e.estimates,year)
          //console.log("latest:" + JSON.stringify(period))
          if (period != undefined ) {
            diff = year - period.year 
            increase = diff * .02 * period.amount
            tmp = Math.round(period.amount + increase)
          }
        }
        //console.log(e.name + " " + tmp)
        amount +=  tmp
      })

    } else {

      expense = expenses.filter(function(x) { return x.id === expense_id; })[0];
      if (expense != undefined ) {
        //console.log("expense:" + JSON.stringify(expense))
        period = get_expense_period(expense.estimates,year)
        //console.log("actual:" + JSON.stringify(period))
        if (period != undefined ) {
          amount = period.amount
        } else {
          period = get_latest_expense_period(expense.estimates,year)
          //console.log("estimate:" + JSON.stringify(period))
          if (period != undefined ) {
            diff = year - period.year 
            increase = diff * .02 * period.amount
            amount = Math.round(period.amount + increase)
          }
        }
      }

    }
    
    
    if (psf == true) {
      return Math.round(amount / sqft * 100) / 100
    } else {
      return amount
    }
    

  }

  get_capex = function(year,scenario) {
    if (scenario == undefined ) { return 0 }
    //find all leases
    total = 0
    if (scenario.capex != undefined) {
      total = scenario.capex
    }
    return total
  }  
 
  


