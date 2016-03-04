window.Ag ?= {}

class Dashboard

  menuId: "toolbox-menu"
  containerId: "active-widget-container"
  widgetCount: 0

  addDraggingClass: ->
    $("#active-widget-container").addClass("dragging")

  constructor: ->
    @enableWidgetDragging()

  enableWidgetDragging: ->
    dashMenu = document.querySelector("##{@menuId}")
    dashContainer = document.querySelector("##{@containerId}")
    dashContainerWidth = dashContainer.offsetWidth + "px"

    @drake = dragula([dashMenu, dashContainer], {
      copy: true
      accepts: (el, target, source, sibling) =>
        if window.Ag.Dashboard.creationMode == false
          return target.id is @containerId
    })

    @drake.on('drag', (el) =>
      el.className = el.className.replace('ex-moved', '')
      $(".gu-mirror").attr("width", dashContainerWidth)
      #@addDraggingClass()
    ).on('drop', (el, target, source, sibling) =>
      #@removeDraggingClass()
      return unless target?.id is @containerId
      el.id = "widget-#{@widgetCount}"
      el.className += ' ex-moved widget widget-creation'
      setTimeout( ->
        el.className += " initialized"
      , 30)
      @initWidget(el)
      @widgetCount++
      window.Ag.Dashboard.creationMode = true
    ).on("moves", (el) ->
      return false
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

  removeDraggingClass: ->
    $("#active-widget-container").removeClass("dragging")

  widgetTitleListener: ->
    $(".widget-title").on("blur", ->
      @.removeClass("editing")
    )

$( ->
  new Dashboard()
)

window.Ag.Dashboard ?= {}
window.Ag.Dashboard.creationMode = false
