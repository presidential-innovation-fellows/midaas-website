class ChartAbstract

  constructor: (@id, @config) ->
    @initInteract()
    @initObservers()
    @initChart()

  initChart: ->
    # overwrite/extend this

  initInteract: ->
    @interact = Ag.Interact.Create(@)
    $("##{@id}").on("interact", (evt, queryUpdate) =>
      @interact.react(queryUpdate)
    )

  initObservers: ->
    @observers = {
      type: new PathObserver(@config, "interact.type")
    }

    @observers.type.open((type, oldType) =>
      @initInteract()
      @initChart()
    )

  showLoading: ->
    $("##{@id} #loading-icon").fadeIn("fast")

  hideLoading: ->
    $("##{@id} #loading-icon").fadeOut("fast")

  closeObservers: ->
    for observerKey, observer of @observers
      observer.close()

  destroy: ->
    @closeObservers()
    @interact.destroy()
    $("##{@id}").html("")

window.Ag ?= {}
window.Ag.Chart ?= {}
window.Ag.Chart.Abstract = ChartAbstract
