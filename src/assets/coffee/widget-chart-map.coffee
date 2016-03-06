class WidgetChartMap extends Ag.Widget.Abstract

  constructor: (el) ->
    template = "/assets/templates/widget-chart-map.html"
    $(el).load(template, null, =>
      @init(el)
    )

window.Ag.Widget ?= {}
window.Ag.Widget.ChartMap = WidgetChartMap
