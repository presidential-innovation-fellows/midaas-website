class WidgetChartBar extends Ag.Widget.Abstract

  constructor: (el) ->
    template = "/assets/templates/widget-chart-bar.html"
    $(el).load(template, null, =>
      @enableDragging(el, "#data-menu" )
      @enableDragging(el, "#demographic-menu" )
      @enableDragging(el, "#geographic-menu" )
    )

window.Ag ?= {}
window.Ag.Widget.ChartBar ?= {}
window.Ag.Widget.ChartBar = WidgetChartBar

