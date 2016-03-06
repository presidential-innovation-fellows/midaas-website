class InteractAbstract

  apiUrlBase: "https://brbimhg0w9.execute-api.us-west-2.amazonaws.com/dev/"

  constructor: (@chart) ->
    @config = @chart.config?.interact
    # ensure config has required parts
    @config.ui ?= {}
    @config.query ?= {}
    @initObservers()

  # should be called after template is loaded
  initUi: ->
    @setTitle()
    for uiKey, include of @config?.ui
      unless include
        $("##{@chart.id} ##{uiKey}").hide()

  initObservers: ->
    @observers = {
      ui: new ObjectObserver(@config.ui)
      query: new ObjectObserver(@config.query)
      title: new PathObserver(@chart.config, "title")
    }

    @observers.ui.open((added, removed, changed, getOldValueFn) =>
      @initUi()
    )
    @observers.query.open((added, removed, changed, getOldValueFn) =>
      @chart.update()
    )
    @observers.title.open((title, oldTitle) =>
      if title isnt oldTitle
        @setTitle()
    )

  closeObservers: ->
    for observerKey, observer of @observers
      observer.close()

  # extend this
  fetchData: (callback) ->
    err = null
    data = null
    return callback(err, data)

  setTitle: ->
    el = $("##{@chart.id}")
    title = @chart.config?.title
    el.find(".chart-title").text(title)

  # triggers interaction with another chart (defined by the
  # `connect` property)
  trigger: (selectionValue) =>
    return unless @config.connect?
    queryKey = switch @config.query?.compare?.toLowerCase()
      when "race" then "compareRace"
      when "sex", "gender" then "compareSex"
      when "age" then "compareAge"
      when "state" then "compareRegion"

    queryUpdate = {}
    queryUpdate[queryKey] = selectionValue
    $("##{@config.connect}").trigger("interact", queryUpdate)

  # extend this
  react: (queryUpdate) ->
    return null

  destroy: ->
    @closeObservers()

window.Ag ?= {}
window.Ag.Interact ?= {}
window.Ag.Interact.Abstract = InteractAbstract
