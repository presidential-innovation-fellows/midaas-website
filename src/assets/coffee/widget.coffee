editConfigForWidget = (widgetId) ->
  widget = {
    title: $('#widget-0 input.widget-title')?.val()
    type: $("##{widgetId}")?.attr("data-widget")
    data: $("##{widgetId}-data-drop")?.attr("data-selection")
    geographic: $("##{widgetId}-geographic-drop")?.attr("data-selection")
    demographic: $("##{widgetId}-demographic-drop")?.attr("data-selection")
  }

  chartTitle = widget.title ? ""

  chartType = {
    "bar-chart": "bar"
    "map-chart": "map"
  }[widget.type]
  return unless chartType?

  chartInteract = {
    "quantiles": "IncomeQuantilesCompare"
    "ratios": "IncomeQuantileRatio"
  }[widget.data] ? "IncomeQuantilesCompare"

  chartDemographic = {
    "all": "overall"
    "gender": "gender"
    "age": "age"
    "race": "race"
  }[widget.demographic] ? "overall"

  chart = {
    title: chartTitle
    type: chartType
    interact: {
      type: chartInteract
      query: {
        compare: chartDemographic
        compareRegion: "US"
      }
      ui: {
        compare: false
        compareRegion: false
      }
    }
  }

  Ag.config[widgetId] = chart

window.Ag.Widget ?= {}
window.Ag.Widget.editConfigForWidget = editConfigForWidget
