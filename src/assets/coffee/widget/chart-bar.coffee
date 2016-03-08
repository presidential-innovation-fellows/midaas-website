class WidgetChartBar extends Ag.Widget.Abstract

  constructor: (el) ->
    template = "/assets/templates/widget/chart-bar.html"
    $(el).load(template, null, =>
      @init(el)
    )

window.Ag.Widget ?= {}
window.Ag.Widget.ChartBar = WidgetChartBar
