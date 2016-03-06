class InteractIncomeQuantileRatio extends Ag.Interact.Abstract

  constructor: (@chart) ->
    super(@chart)
    el = $("##{@chart.id}")
    template = "/assets/templates/income-quantile-ratio.html"
    $("##{@chart.id}").load(template, null, =>
      @initUi()
    )

  initUi: ->
    super()
    @react(@config.query)
    $("##{@chart.id} #compareQuantile").val(@config.query?.compareQuantile ? "50")
    $("##{@chart.id} #compareQuantile").change((event) =>
      @react({ compareQuantile: event.target.value })
    )

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
          data[quantile] ?= {}
          data[quantile][state] = nData[state][quantile] / dData[state][quantile]
      return callback(null, data)
    ).fail((err) =>
      return callback(err)
    )

  react: (queryUpdate) ->
    return unless queryUpdate?
    @config.query ?= {}

    compareQuantile = parseInt(queryUpdate.compareQuantile)
    if compareQuantile >= 0 and compareQuantile <= 100
      @config.query.compareQuantile = compareQuantile
      $("##{@chart.id} #compareQuantile").val(compareQuantile)

window.Ag ?= {}
window.Ag.Interact ?= {}
window.Ag.Interact.IncomeQuantileRatio = InteractIncomeQuantileRatio
