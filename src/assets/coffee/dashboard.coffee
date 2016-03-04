window.Ag ?= {}

class Dashboard

  constructor: ->
    @enableWidgetDragging()

  enableWidgetDragging: ->
    dashMenu = document.querySelector("#toolbox-menu")
    dashContainer = document.querySelector("#active-widget-container")
    dashContainerWidth = dashContainer.offsetWidth + "px"

    drake = dragula([dashMenu, dashContainer],
      copy: true,
    )

    drake.on('drag', (el) =>
      el.className = el.className.replace('ex-moved', '')
      $(".gu-mirror").attr("width", dashContainerWidth)
    ).on('drop', (el) =>
      window.Ag.Dashboard.widgetCount += 1
      el.id = "widget-" + window.Ag.Dashboard.widgetCount
      el.className += ' ex-moved widget'
      @initWidget(el)
    ).on("moves", (el) ->
      return false
    ).on('over', (el, container) ->
      container.className += ' ex-over'
    ).on('out', (el, container) ->
      container.className = container.className.replace('ex-over', '')
    )

  initWidget: (el) ->
    widgetType = el.getAttribute("data-widget")
    console.log "initWidget", widgetType

    switch widgetType
      when "bar-chart"
        new Ag.Widget.ChartBar(el)

  widgetTitleListener: ->
    $(".widget-title").on("blur", ->
      @.removeClass("editing")
    )

$( ->
  new Dashboard()
)

window.Ag.Dashboard ?= {}
window.Ag.Dashboard.widgetCount = 0
