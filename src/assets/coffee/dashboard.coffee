window.Ag ?= {}

class Dashboard

  constructor: ->
    @enableDragging()

  enableDragging: ->
    dashMenu = document.querySelector("#toolbox-menu")
    dashContainer = document.querySelector("#active-widget-container")
    dashContainerWidth = dashContainer.offsetWidth + "px"
    widgetCount = 0

    dragula([dashMenu, dashContainer],
      copy: true,
    ).on('drag', (el) ->
      el.className = el.className.replace('ex-moved', '')
      $(".gu-mirror").attr("width", dashContainerWidth)
    ).on('drop', (el) =>
      el.className += ' ex-moved widget'
      widgetCount += 1
      el.id = "widget-" + widgetCount
      @initWidget(el)
    ).on('over', (el, container) ->
      container.className += ' ex-over'
    ).on('out', (el, container) ->
      container.className = container.className.replace('ex-over', '')
    )

  initWidget: (el) ->
    widgetType = el.getAttribute("data-widget")

    switch widgetType
      when "bar-chart"
        new Ag.Widget.ChartBar(el)

$( ->
  new Dashboard()
)
