class WidgetAbstract
  constructor: ->
    return null

  addDragClassToBody: ->
    body = document.body
    body.className = body.className += " open-widget-attributes"


  animateCompletionBar: (draggedElement, widgetId) ->
    completionBar = widgetId + " .completion-bar"
    dataType = draggedElement.getAttribute("data-type")

    switch dataType
      when "data"
        dataBar = document.querySelector(completionBar + " .data")
        dataBar.className += " complete"
      when "demographic"
        dataBar = document.querySelector(completionBar + " .demographic")
        dataBar.className += " complete"
      when "geographic"
        dataBar = document.querySelector(completionBar + " .geographic")
        dataBar.className += " complete"

    @checkCompleteness(dataType, widgetId)

  checkCompleteness: (dataType, widgetId) ->
    dragItem = widgetId + " .data-drop .drag-item"

    if $(dragItem).attr("data-dataset") == "quantiles"
      @closeDrawer(widgetId)
    else if ($(dragItem).attr("data-dataset") == "ratio")
      if $(widgetId + " .demographic-drop .drag-item").length > 0
        @closeDrawer(widgetId)
      else
        @openDrawer(widgetId)

  closeDrawer: (widgetId) ->
    $(widgetId).addClass("closed")


  enableDragging: (el, menuId) ->
    widgetId = "#" + el.id
    dataMenu = document.querySelector(menuId)
    dataType = document.querySelector(menuId + " li").getAttribute("data-type")
    dataDrop = document.querySelector(widgetId + " ." + dataType + "-drop")

    dragula([dataMenu, dataDrop],
      copy: true,
    ).on('drag', (el) =>
      @addDragClassToBody()
      el.className = el.className.replace('ex-moved', '')
    ).on('drop', (el) =>
      @removeExistingDrop(dataDrop, el, widgetId)
      @animateCompletionBar(el, widgetId)
      @removeDragClassFromBody()
      el.className += ' ex-moved'
    ).on('over', (el, container) ->
      container.className += ' ex-over'
    ).on('out', (el, container) ->
      container.className = container.className.replace("ex-over", "")
    )

  openDrawer: (widgetId) ->
    $(widgetId).removeClass("closed")

  removeDragClassFromBody: ->
    $("body").removeClass("open-widget-attributes")

  removeExistingDrop: (dataDrop, el, widgetId) ->
    dataDrop.className += " full"
    dataType = el.getAttribute("data-type")
    $(widgetId + widgetId + " ." + dataType + "-drop .ex-moved").remove()

window.Ag ?= {}
window.Ag.Widget ?= {}
window.Ag.Widget.Abstract = WidgetAbstract
