class WidgetAbstract
  constructor: ->
    return null

  addDestroyListener: (el) ->
    widgetId = "#" + el.id
    $(widgetId + " .widget-remove").on("click", =>
      @destroyWidget(widgetId)
    )

  addDragClassToBody: ->
    body = document.body
    body.className = body.className += " open-widget-attributes"

  addDragEventListeners: (drake, dropLocation, menuId, widgetId) ->
    drake.on('drag', (el) =>
      @addDragClassToBody()
      el.className = el.className.replace('ex-moved', '')
    ).on('drop', (el, container) =>
      el.className += ' ex-moved'
      @removeExistingDrop(dropLocation, el, widgetId, container)
      @animateCompletionBar(el, widgetId)
      @removeDragClassFromBody()
    ).on('over', (el, container) ->
      container.className += ' ex-over'
    ).on('out', (el, container) ->
      container.className = container.className.replace("ex-over", "")
    )

  addIdsToDrops: (el) ->
    widgetId = "#" + el.id

    $(widgetId + " .widget-attributes li").each( ->
      dataType = @.getAttribute("data-type")
      $(@).attr("id", el.id + "-" + dataType + "-drop")
    )


  animateCompletionBar: (draggedElement, widgetId) ->
    completionBarSelector = widgetId + " .completion-bar"
    dataType = draggedElement.getAttribute("data-type")
    dragItem = widgetId + " ." + dataType + "-drop .drag-item"

    if $(dragItem).length > 0

      switch dataType
        when "data"
          $bar = $(completionBarSelector).find(".data")
          unless $bar.hasClass("complete")
            $bar.addClass("complete")
        when "demographic"
          $bar = $(completionBarSelector).find(".demographic")
          unless $bar.hasClass("complete")
            $bar.addClass("complete")
        when "geographic"
          $bar = $(completionBarSelector).find(".geographic")
          unless $bar.hasClass("complete")
            $bar.addClass("complete")

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

  destroyWidget: (widgetId) ->
    $(widgetId + " .drag-item").unbind()
    $(widgetId).remove()

  enableDragging: (el, menuId) ->
    widgetId = "#" + el.id
    dataType = document.querySelector(menuId + " li").getAttribute("data-type")
    dropLocation = document.querySelector(widgetId + "-" + dataType + "-drop")
    dataMenu = document.querySelector(menuId)

    if !$("#active-widget-container").hasClass("dropped")

      switch dataType
        when "demographic"
          window.Ag.Widget.demographicDrake = dragula([dataMenu], copy: true)
          window.Ag.Widget.demographicDrake.containers.push(dropLocation)
          @addDragEventListeners(window.Ag.Widget.demographicDrake, dropLocation, menuId, widgetId)
        when "data"
          window.Ag.Widget.dataDrake = dragula([dataMenu], copy: true)
          window.Ag.Widget.dataDrake.containers.push(dropLocation)
          @addDragEventListeners(window.Ag.Widget.dataDrake, dropLocation, menuId, widgetId)
        when "geographic"
          window.Ag.Widget.geographicDrake = dragula([dataMenu], copy: true)
          window.Ag.Widget.geographicDrake.containers.push(dropLocation)
          @addDragEventListeners(window.Ag.Widget.geographicDrake, dropLocation, menuId, widgetId)
          $("#active-widget-container").addClass("dropped")
    else
      switch dataType
        when "demographic"
          window.Ag.Widget.demographicDrake.containers.push(dropLocation)
          @addDragEventListeners(window.Ag.Widget.demographicDrake, dropLocation, menuId, widgetId)
        when "data"
          window.Ag.Widget.dataDrake.containers.push(dropLocation)
          @addDragEventListeners(window.Ag.Widget.dataDrake, dropLocation, menuId, widgetId)
        when "geographic"
          window.Ag.Widget.geographicDrake.containers.push(dropLocation)
          @addDragEventListeners(window.Ag.Widget.geographicDrake, dropLocation, menuId, widgetId)


  openDrawer: (widgetId) ->
    $(widgetId).removeClass("closed")

  removeDragClassFromBody: ->
    $("body").removeClass("open-widget-attributes")

  removeExistingDrop: (dataDrop, el, widgetId, container) ->
    dataType = el.getAttribute("data-type")

    if $("#" + container.id + " .ex-moved").length > 1
      $("#" + container.id + " .ex-moved:first").remove()

  widgetTitleListener: (el) ->
    $("#" + el.id + " .widget-title").on("blur", ->
      $(@).removeClass("editing")
    ).on("focus", ->
      $(@).addClass("editing")
    )

window.Ag ?= {}
window.Ag.Widget ?= {}
window.Ag.Widget.Abstract = WidgetAbstract
window.Ag.Widget.cartridgeDragging = false
