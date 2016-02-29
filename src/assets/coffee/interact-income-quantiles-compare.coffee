class InteractIncomeQuantilesCompare extends Ag.Interact.Abstract

  constructor: (@chart) ->
    super(@chart)
    el = $("##{@chart.id}")
    template = "/assets/templates/income-quantiles-compare.html"
    $("##{@chart.id}").load(template, null, =>
      @initUi()
    )

  initUi: ->
    super()
    $("##{@chart.id} #compare .toggle").on("click", (event) =>
      @config.query ?= {}
      @config.query.compare = event.currentTarget.innerText
      @chart.update()
      $("##{@chart.id} #compare .toggles li").removeClass("active")
      $(event.target).addClass("active")
    )
    $("##{@chart.id} #compareRegion").change((event) =>
      @config.query ?= {}
      @config.query.compareRegion = event.target.value
      @chart.update()
    )

  getApiUrl: =>
    return "#{@apiUrlBase}income/quantiles"

  fetchData: (callback) =>
    params = []
    url = @getApiUrl()

    compare = @config?.query?.compare?.toLowerCase()
    compareRegion = @config?.query?.compareRegion?.toUpperCase()
    switch compare
      when "race"
        params.push("compare=race")
      when "gender", "sex"
        params.push("compare=sex")
      when "age"
        params.push("compare=agegroup")

    if compareRegion and compareRegion isnt "US"
      params.push("state=" + compareRegion);

    if params.length
      url += "?" + params.join('&')

    $.ajax({
      dataType: "json"
      url: url
      timeout: 10000
    }).done((data) =>
      seriesArr = []
      for group of data
        labelArr = ["x"]
        dataArr = [group]
        for percentile of data[group]
          labelArr.push(percentile)
          dataArr.push(data[group][percentile])
        seriesArr.push(dataArr)
      return callback(null, [labelArr].concat(seriesArr))
    ).fail((err) =>
      return callback(err)
    )

window.Ag ?= {}
window.Ag.Interact ?= {}
window.Ag.Interact.IncomeQuantilesCompare = InteractIncomeQuantilesCompare
