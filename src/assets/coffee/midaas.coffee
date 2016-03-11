window.Ag ?= {}

class Midaas

  charts: {}
  observers: {}

  constructor: ->
    @initConfig()
    @createCharts()
    @initObserveCheck()

  initConfig: ->
    # attempt to get the midaas configuration from either the url
    # param or from its definition as a script on the page
    configParam = $.url("?midaasConfig")
    if configParam
      config = JSON.parse(decodeURIComponent(configParam))
    else
      config = Ag.config ? {}

    Ag.config = config

  createChart: (id, config) ->
    Ag.charts[id] = @charts[id] = Ag.Chart.Create(id, config)
    @observers["chart_#{id}"] = new PathObserver(config, "type")
    @observers["chart_#{id}"].open((type, oldType) =>
      @destroyChart(id)
      @createChart(id, Ag.config[id])
    )

  destroyChart: (id) ->
    @observers["chart_#{id}"].close()
    @charts[id].destroy()
    delete @charts[id]
    delete Ag.charts[id]

  createCharts: ->
    Ag.charts = @charts = {}
    for id, config of Ag.config
      @createChart(id, config)

    # observe changes to chart keys
    @observers.charts = new ObjectObserver(Ag.config)
    @observers.charts.open((added, removed, changed, getOldValueFn) =>
      Object.keys(added).forEach((id) =>
        config = added[id]
        @createChart(id, config)
      )
      Object.keys(removed).forEach((id) =>
        config = removed[id]
        @destroyChart(id)
      )
    )

  initObserveCheck: ->
    unless Object.observe?
      setInterval( ->
        Platform.performMicrotaskCheckpoint()
      , 100)

# on load
$( =>
  new Midaas()

  # window.history.pushState(midaas, document.title, "?midaas=#{encodeURIComponent(JSON.stringify(midaas))}")

  # observe changes to history

)
