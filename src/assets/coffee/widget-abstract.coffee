class WidgetAbstract
  constructor: ->
    return null

  addCreateListener: ->
    $(".widget-creation .create-button").on("click", =>
      $(".widget-creation").removeClass("widget-creation")
      @completeWidget()
    )

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
      dataType = el.getAttribute("data-type")
      @addDragClassToBody()
      el.className = el.className.replace('ex-moved', '')
      $("." + dataType + "-drop").addClass("droppable")
    ).on('drop', (el, container) =>
      dataType = el.getAttribute("data-type")
      el.className += ' ex-moved'

      console.log("Container:", container)

      @removeExistingDrop(dropLocation, el, widgetId, container)
      @animateCompletionBar(el, widgetId)
      @removeDragClassFromBody()
      $(".droppable").removeClass("droppable")
    ).on('over', (el, container) ->
      container.className += ' ex-over'
      if $("#" + container.id).hasClass("drop")
        $widget = $("#" + container.id).closest(".widget")
        $widget.removeClass("closed")
    ).on('out', (el, container) ->
      container.className = container.className.replace("ex-over", "")
      $widget = $("#" + container.id).closest(".widget")
      $widget.addClass("closed")
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
    $(widgetId).removeClass("initialized").addClass("closed")

  completeWidget: ->
    #Balint Function Here
    @disableCreationMode()

  destroyWidget: (widgetId) ->
    $(widgetId + " .drag-item").unbind()
    $(widgetId).remove()
    @disableCreationMode()

  disableCreationMode: ->
    $("body").removeClass("creation-mode")
    $("#toolbox-menu").removeClass("disable-menu")
    $(".create-button").remove()

    window.Ag.Dashboard.creationMode = false

  enableCreationMode: ->
    $("body").addClass("creation-mode")
    $("#active-widget-container").addClass("dropped")
    $("#toolbox-menu").addClass("disable-menu")

    @addCreateListener()

  enableDragging: (el, menuId) ->
    widgetId = "#" + el.id
    dataType = document.querySelector(menuId + " li").getAttribute("data-type")
    dropLocation = document.querySelector(widgetId + "-" + dataType + "-drop")
    dataMenu = document.querySelector(menuId)

    if $("#active-widget-container").hasClass("dropped")
      window.Ag.Widget.dataDrake.destroy()
      window.Ag.Widget.demographicDrake.destroy()
      window.Ag.Widget.geographicDrake.destroy()
      $("#active-widget-container").removeClass("dropped")

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
        @enableCreationMode()


  openDrawer: (widgetId) ->
    $(widgetId).removeClass("closed")

  removeDragClassFromBody: ->
    $("body").removeClass("open-widget-attributes")

  removeExistingDrop: (dataDrop, el, widgetId, container) ->
    dataType = el.getAttribute("data-type")

    if $("#" + container.id + " .ex-moved").length > 1
      $("#" + container.id + " .ex-moved:first").remove()

    else
      $("#" + container.id).addClass("cartridge-full")

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
