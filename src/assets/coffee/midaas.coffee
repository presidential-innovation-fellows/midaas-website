window.Ag ?= {}

class Midaas

  constructor: ->
    @getConfig()
    @createCharts()

  getConfig: ->
    # attempt to get the midaas configuration from either the url
    # param or from its definition as a script on the page
    unless window.Ag.config?
      configParam = $.url("?midaasConfig")
      if configParam
        @config = JSON.parse(decodeURIComponent(configParam))
      else
        @config = {}
    else
      @config = window.Ag.config

  createChart: (id, config) ->
    switch config?.type
      when "bar"
        return new Ag.Chart.Bar(id, config)
      when "map"
        return new Ag.Chart.Map(id, config)

  createCharts: ->
    @charts = []
    for id, config of @config
      @charts.push(@createChart(id, config))

# on load
$( =>
  new Midaas()

  # window.history.pushState(midaas, document.title, "?midaas=#{encodeURIComponent(JSON.stringify(midaas))}")

  # observe changes to history

)
