class InteractAbstract

  apiUrlBase: "https://brbimhg0w9.execute-api.us-west-2.amazonaws.com/dev/"

  constructor: (@chart) ->
    @config = @chart.config?.interact

  # should be called after template is loaded
  initUi: ->
    @setTitle()
    for uiKey, include of @config?.ui
      unless include
        $("##{@chart.id} ##{uiKey}").hide()

  # extend this
  fetchData: (callback) ->
    err = null
    data = null
    return callback(err, data)

  setTitle: ->
    el = $("##{@chart.id}")
    title = @chart.config?.title
    el.find(".chart-title").text(title)

window.Ag ?= {}
window.Ag.Interact ?= {}
window.Ag.Interact.Abstract = InteractAbstract
