class DataRequesterAbstract

  apiUrlBase: "https://brbimhg0w9.execute-api.us-west-2.amazonaws.com/dev/"

  constructor: (@chart) ->
    @config = @chart.config?.dataRequester
    # ensure config has required parts
    @config.query ?= {}

  # extend this
  fetchData: (callback) ->
    err = null
    data = null
    return callback(err, data)

  # extend this
  react: (queryUpdate) ->
    return null

  closeObservers: ->
    for observerKey, observer of @observers
      observer.close()

  destroy: ->
    @closeObservers()

window.Ag ?= {}
window.Ag.DataRequester ?= {}
window.Ag.DataRequester.Abstract = DataRequesterAbstract
