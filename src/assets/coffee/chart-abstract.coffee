class ChartAbstract

  constructor: (@id, @config) ->
    @initInteract()

  initInteract: ->
    interact = @config?.interact
    api = interact?.api?.toLowerCase()
    unless api?
      return console.error(new Error("Missing interact.api in Ag config."))
    switch api
      when "income/quantiles?compare"
        @interact = new Ag.Interact.IncomeQuantilesCompare(@)

  showLoading: ->
    $("##{@id} #loading-icon").fadeIn("fast")

  hideLoading: ->
    $("##{@id} #loading-icon").fadeOut("fast")

window.Ag ?= {}
window.Ag.Chart ?= {}
window.Ag.Chart.Abstract = ChartAbstract
