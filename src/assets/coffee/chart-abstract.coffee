class ChartAbstract

  constructor: (@id, @config) ->
    @initInteract()

  initInteract: ->
    interact = @config?.interact
    type = interact?.type
    unless type?
      return console.error(new Error("Missing interact.type in Ag config."))
    switch type
      when "IncomeQuantilesCompare"
        @interact = new Ag.Interact.IncomeQuantilesCompare(@)
      when "IncomeQuantileGenderRatio"
        @interact = new Ag.Interact.IncomeQuantileGenderRatio(@)

  showLoading: ->
    $("##{@id} #loading-icon").fadeIn("fast")

  hideLoading: ->
    $("##{@id} #loading-icon").fadeOut("fast")

window.Ag ?= {}
window.Ag.Chart ?= {}
window.Ag.Chart.Abstract = ChartAbstract
