createChart = (id, config) ->
  switch config?.type
    when "bar"
      return new Ag.Chart.Bar(id, config)
    when "map"
      return new Ag.Chart.Map(id, config)

window.Ag ?= {}
window.Ag.Chart ?= {}
window.Ag.Chart.Create = createChart
