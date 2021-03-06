class DataRequesterIncomeQuantileRatio extends Ag.DataRequester.Abstract

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

    compareQuantile = query.compareQuantile
    if parseInt(compareQuantile) >= 0 and parseInt(compareQuantile) <= 100
      params.push("quantile=#{compareQuantile}")

    ratioType = query.ratioType?.toLowerCase()
    ratioNumerator = query.ratioNumerator?.toLowerCase()
    ratioDenominator = query.ratioDenominator?.toLowerCase()

    paramsNumerator = params.concat("#{ratioType}=#{ratioNumerator}")
    paramsDenominator = params.concat("#{ratioType}=#{ratioDenominator}")

    $.when(
      $.ajax({
        dataType: "json"
        url: "#{url}?#{paramsNumerator.join('&')}"
        timeout: 10000
      }),
      $.ajax({
        dataType: "json"
        url: "#{url}?#{paramsDenominator.join('&')}"
        timeout: 10000
      })
    ).done((nResponse, dResponse) =>
      nData = nResponse[0]
      dData = dResponse[0]
      data = {}
      for state of nData
        for quantile of nData[state]
          data[state] ?= {}
          data[state][quantile] = nData[state][quantile] / dData[state][quantile]
      data.yLabel = "Ratio #{ratioNumerator}/#{ratioDenominator}"
      return callback(null, data)
    ).fail((err) =>
      return callback(err)
    )

window.Ag ?= {}
window.Ag.DataRequester ?= {}
window.Ag.DataRequester.IncomeQuantileRatio = DataRequesterIncomeQuantileRatio
