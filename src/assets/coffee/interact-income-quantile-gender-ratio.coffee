class InteractIncomeQuantileGenderRatio extends Ag.Interact.Abstract

  constructor: (@chart) ->
    super(@chart)
    el = $("##{@chart.id}")
    template = "/assets/templates/income-quantile-gender-ratio.html"
    $("##{@chart.id}").load(template, null, =>
      @initUi()
    )

  initUi: ->
    super()
    $("##{@chart.id} #compareQuantile").val(@config.query?.compareQuantile ? "50")
    $("##{@chart.id} #compareQuantile").change((event) =>
      @config.query ?= {}
      @config.query.compareQuantile = event.target.value
      @chart.update()
    )

  getApiUrl: =>
    return "#{@apiUrlBase}income/quantiles?compare=state"

  fetchData: (callback) =>
    params = []
    url = @getApiUrl()

    compareQuantile = @config?.query?.compareQuantile

    if parseInt(compareQuantile) >= 0 and parseInt(compareQuantile) <= 100
      url += "&quantile=#{compareQuantile}"

    $.when(
      $.ajax({
        dataType: "json"
        url: url + "&sex=male"
        timeout: 10000
      }),
      $.ajax({
        dataType: "json"
        url: url + "&sex=female"
        timeout: 10000
      })
    ).done((mResponse, fResponse) =>
      mData = mResponse[0]
      fData = fResponse[0]
      data = {}
      for state of mData
        for quantile of mData[state]
          data[quantile] ?= {}
          data[quantile][state] = fData[state][quantile] / mData[state][quantile]
      return callback(null, data)
    ).fail((err) =>
      return callback(err)
    )

window.Ag ?= {}
window.Ag.Interact ?= {}
window.Ag.Interact.IncomeQuantileGenderRatio = InteractIncomeQuantileGenderRatio
