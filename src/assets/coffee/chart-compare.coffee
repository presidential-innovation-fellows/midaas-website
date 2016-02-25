class ChartCompare extends Chart

  constructor: (@chartId) ->
    chartEl = $(@chartId)
    @query = {
      compare: chartEl.attr('compare') ? "Overall"
      compareRegion: chartEl.attr('compare-region') ? "US"
    }
    chartTemplate = "/assets/templates/chart-compare.html"
    $("#{@chartId}").load(chartTemplate, null, =>
      @setTitle(@chartId)
      @_bindToggles()
      @init()
    )

  getApiUrl: =>
    return "#{@apiUrlBase}income/quantiles"

  fetchData: (callback) =>
    params = []
    url = @getApiUrl()

    switch @query.compare.toLowerCase()
      when "race"
        params.push("compare=race")
      when "gender", "sex"
        params.push("compare=sex")
      when "age"
        params.push("compare=agegroup")

    if @query.compareRegion? and @query.compareRegion isnt "US"
      params.push("state=" + @query.compareRegion);

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

  setTitle: (chartId) ->
    chartEl = $(@chartId)
    title = chartEl.attr("title")
    chartEl.find(".chart-title").text(title)

  _bindToggles: ->
    $("#{@chartId} .toggle").on("click", (event) =>
      @query.compare = event.currentTarget.innerText
      @update()
      $("#{@chartId} .toggles li").removeClass("active")
      $(event.target).addClass("active")
    )
    $("#{@chartId} #region-selector").change((event) =>
      @query.compareRegion = event.target.value
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
