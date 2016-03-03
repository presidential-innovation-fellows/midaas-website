createInteract = (chart) ->
  interact = chart?.config?.interact
  type = interact?.type
  unless type?
    return console.error(new Error("Missing interact.type in Ag config."))
  switch type
    when "IncomeQuantilesCompare"
      return new Ag.Interact.IncomeQuantilesCompare(chart)
    when "IncomeQuantileRatio"
      return new Ag.Interact.IncomeQuantileRatio(chart)

window.Ag ?= {}
window.Ag.Interact ?= {}
window.Ag.Interact.Create = createInteract
