class DataRequesterIncomeQuantilesCompare extends Ag.DataRequester.Abstract

  getApiUrl: =>
    return "#{@apiUrlBase}income/quantiles"

  fetchData: (callback) =>
    params = []
    url = @getApiUrl()
    query = @config?.query

    compare = query.compare?.toLowerCase()
    switch compare
      when "race"
        params.push("compare=race")
      when "gender", "sex"
        params.push("compare=sex")
      when "age"
        params.push("compare=agegroup")
      when "state"
        params.push("compare=state")

    compareRegion = query.compareRegion?.toUpperCase()
    if compareRegion and compareRegion isnt "US"
      params.push("state=" + encodeURIComponent(compareRegion))

    compareRace = query.compareRace?.toLowerCase()
    if compareRace
      params.push("race=" + encodeURIComponent(compareRace))

    compareGender = query.compareGender?.toLowerCase()
    if compareGender
      params.push("sex=" + encodeURIComponent(compareGender))

    compareAge = query.compareAge?.toLowerCase()
    if compareAge
      params.push("agegroup=" + encodeURIComponent(compareAge))

    compareQuantile = query.compareQuantile
    if parseInt(compareQuantile) >= 0 and parseInt(compareQuantile) <= 100
      params.push("quantile=#{compareQuantile}")

    if params.length
      url += "?" + params.join('&')

    $.ajax({
      dataType: "json"
      url: url
      timeout: 10000
    }).done((data) =>
      data.xLabel = "Quantile"
      data.yLabel = "Earnings ($s)"
      return callback(null, data)
    ).fail((err) =>
      return callback(err)
    )

window.Ag ?= {}
window.Ag.DataRequester ?= {}
window.Ag.DataRequester.IncomeQuantilesCompare = DataRequesterIncomeQuantilesCompare
