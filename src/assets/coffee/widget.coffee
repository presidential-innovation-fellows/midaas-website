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

  chartInteract = {
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
    interact: {
      type: chartInteract
      query: {
        compare: chartDemographic
      }
      ui: {
        compare: false
        compareRegion: false
        compareQuantile: false
      }
    }
  }

  if chart.type is "bar"
    if chartGeographic is "state"
      chart.interact.query.compareRegion = "CA"
      chart.interact.ui.compareRegion = true
    else if chartGeographic is "national"
      chart.interact.query.compareRegion = "US"
  else if chart.type is "map"
    chart.interact.query.compare = "state"

  if chart.interact.type is "IncomeQuantileRatio"
    if chartRatio?
      chart.interact.query.ratioType = chartDemographic
      chart.interact.query.ratioNumerator = chartRatio[0]
      chart.interact.query.ratioDenominator = chartRatio[1]
      chart.interact.query.compareQuantile = 50

  Ag.config[chartId] = chart

window.Ag.Widget ?= {}
window.Ag.Widget.editConfigForWidget = editConfigForWidget
