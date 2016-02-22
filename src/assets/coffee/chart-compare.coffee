class ChartCompare extends Chart

  constructor: (@chartId) ->
    chartTemplate = "/assets/templates/chart-compare.html"
    $("#{@chartId}").load(chartTemplate, null, =>
      @_bindToggles()
      @init()
    )

  query: {
    compare: "Overall"
    compareRegion: "US"
  }

  getApiUrl: =>
    return "#{@apiUrlBase}income/quantiles"

  fetchData: (callback) =>
    params = []
    url = @getApiUrl()

    switch @query.compare
      when "Race"
        params.push("compare=race")
      when "Gender"
        params.push("compare=sex")
      when "Age"
        params.push("compare=agegroup")

    if @query.compare and @query.compare is not "US"
      params.push("state=" + query.compareRegion);

    if params.length
      url += "?#{params.join('&')}"

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

  _bindToggles: ->
    $("#{@chartId} .toggle").on("click", (event) =>
      @query.compare = event.currentTarget.innerText
      @update()
      $("#{@chartId} .toggles li").removeClass("active")
      $(event.target).addClass("active")
    )
    $("#{@chartId} #region-selector").change((event) =>
      @query.region = event.target.value
      @update()
    )

window.ChartCompare = ChartCompare

$(document).ready( =>
  # select all `.chart-compare` elements and turn them
  # into ChartCompares
  $('.chart-compare').each((i) ->
    id = '#' + $(@).attr('id')
    chartCompare = new ChartCompare(id)
  )
)
