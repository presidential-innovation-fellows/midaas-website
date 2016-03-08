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
      params.push("state=" + compareRegion)

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
      return callback(null, data)
    ).fail((err) =>
      return callback(err)
    )

window.Ag ?= {}
window.Ag.DataRequester ?= {}
window.Ag.DataRequester.IncomeQuantilesCompare = DataRequesterIncomeQuantilesCompare
