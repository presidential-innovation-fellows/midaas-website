window.Ag ?= {}

class Dashboard

  menuId: "toolbox-menu"
  containerId: "active-widget-container"
  widgetCount: 0

  constructor: ->
    @enableWidgetDragging()

  enableWidgetDragging: ->
    dashMenu = document.querySelector("##{@menuId}")
    dashContainer = document.querySelector("##{@containerId}")
    dashContainerWidth = dashContainer.offsetWidth + "px"

    @drake = dragula([dashMenu, dashContainer], {
      copy: true
      accepts: (el, target, source, sibling) =>
        return target.id is @containerId
    })

    @drake.on('drag', (el) =>
      el.className = el.className.replace('ex-moved', '')
      $(".gu-mirror").attr("width", dashContainerWidth)
    ).on('drop', (el, target, source, sibling) =>
      return unless target?.id is @containerId
      el.id = "widget-#{@widgetCount}"
      el.className += ' ex-moved widget'
      setTimeout( ->
        el.className += " initialized"
      , 30)
      @initWidget(el)
      @widgetCount++
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
