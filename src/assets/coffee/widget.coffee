editConfigForWidget = (widgetId) ->
  widget = {
    title: $('#widget-0 input.widget-title')?.val()
    type: $("##{widgetId}")?.attr("data-widget")
    data: $("##{widgetId}-data-drop")?.attr("data-selection")
    geographic: $("##{widgetId}-geographic-drop")?.attr("data-selection")
    demographic: $("##{widgetId}-demographic-drop")?.attr("data-selection")
  }

  chartId = widgetId + "-chart"

  chartTitle = widget.title ? ""

  chartType = {
    "bar-chart": "bar"
    "map": "map"
  }[widget.type]
  return unless chartType?

  chartDataRequester = {
    "quantiles": "IncomeQuantilesCompare"
    "ratios": "IncomeQuantileRatio"
  }[widget.data] ? "IncomeQuantilesCompare"

  chartRatio = {
    "gender": ["female", "male"]
    "age": ["25-34", "55-64"]
    "race": ["black", "white"]
  }[widget.demographic]

  chartDemographic = {
    "all": "overall"
    "gender": "sex"
    "age": "age"
    "race": "race"
  }[widget.demographic] ? "overall"

  chartGeographic = widget.geographic

  chart = {
    title: chartTitle
    type: chartType
    dataRequester: {
      type: chartDataRequester
      query: {
        compare: chartDemographic
      }
    }
    ui: {
      compare: false
      compareRegion: false
      compareQuantile: false
    }
  }

  if chart.type is "bar"
    if chartGeographic is "state"
      chart.dataRequester.query.compareRegion = "CA"
      chart.ui.compareRegion = true
    else if chartGeographic is "national"
      chart.dataRequester.query.compareRegion = "US"
  else if chart.type is "map"
    chart.dataRequester.query.compare = "state"

  if chart.dataRequester.type is "IncomeQuantileRatio"
    if chartRatio?
      chart.dataRequester.query.ratioType = chartDemographic
      chart.dataRequester.query.ratioNumerator = chartRatio[0]
      chart.dataRequester.query.ratioDenominator = chartRatio[1]
      chart.dataRequester.query.compareQuantile = 50

  Ag.config[chartId] = chart

window.Ag.Widget ?= {}
window.Ag.Widget.editConfigForWidget = editConfigForWidget
