createDataRequester = (chart) ->
  dataRequester = chart?.config?.dataRequester
  type = dataRequester?.type
  unless type?
    return console.error(new Error("Missing data.type in Ag config."))
  switch type
    when "IncomeQuantilesCompare"
      return new Ag.DataRequester.IncomeQuantilesCompare(chart)
    when "IncomeQuantileRatio"
      return new Ag.DataRequester.IncomeQuantileRatio(chart)

window.Ag ?= {}
window.Ag.DataRequester ?= {}
window.Ag.DataRequester.Create = createDataRequester
