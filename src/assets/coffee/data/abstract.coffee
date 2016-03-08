class DataAbstract

  apiUrlBase: "https://brbimhg0w9.execute-api.us-west-2.amazonaws.com/dev/"

  constructor: (@chart) ->
    @config = @chart.config?.data
    # ensure config has required parts
    @config.query ?= {}
    @initObservers()
    @initUi()

  initObservers: ->
    @observers = {
      query: new ObjectObserver(@config.query)
    }

    @observers.query.open((added, removed, changed, getOldValueFn) =>
      @chart.update()
    )

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
window.Ag.Data ?= {}
window.Ag.Data.Abstract = DataAbstract
