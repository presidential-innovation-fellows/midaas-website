class ChartAbstract

  constructor: (@id, @config) ->
    $("##{@id}").load("/assets/templates/chart.html", null, =>
      @initUi()
      @initDataRequester()
      @initObservers()
      @initChart()
      @initTriggerListeners()
    )

  initUi: ->
    if @config.ui?.compareQuantile
      $.get("/assets/templates/ui/select-compare-quantile.html", (html) =>
        $("##{@id} .ui").append(html)
        $("##{@id} .compareQuantile").change((event) =>
          @react({ compareQuantile: $(event.currentTarget).text().toUpperCase() })
        )
        @react({ compareQuantile: @config.dataRequester?.query?.compareQuantile })
      )

  initChart: ->
    # overwrite/extend this

  initDataRequester: ->
    @dataRequester = Ag.DataRequester.Create(@)

  initObservers: ->
    @observers = {
      title: new PathObserver(@config, "title")
      type: new PathObserver(@config.dataRequester, "type")
      query: new ObjectObserver(@config.dataRequester.query)
      ui: new ObjectObserver(@config.ui)
    }

    @observers.title.open((title, oldTitle) =>
      if title isnt oldTitle
        @setTitle()
    )

    @observers.type.open((type, oldType) =>
      @initDataRequester()
      @initChart()
    )

    @observers.query.open((added, removed, changed, getOldValueFn) =>
      @update()
    )

    @observers.ui.open((added, removed, changed, getOldValueFn) =>
      @initUi()
    )

  initTriggerListeners: ->
    $("##{@id}").on("query-change", (evt, queryUpdate) =>
      @react(queryUpdate)
    )

  # triggers an interaction with another chart (defined by the
  # `connect` property)
  trigger: (selectionValue) =>
    return unless @config.connect?
    queryKey = switch @config.dataRequester?.query?.compare?.toLowerCase()
      when "race" then "compareRace"
      when "sex", "gender" then "compareSex"
      when "age" then "compareAge"
      when "state" then "compareRegion"

    queryUpdate = {}
    queryUpdate[queryKey] = selectionValue
    $("##{@config.connect}").trigger("query-change", queryUpdate)

  react: (queryUpdate) ->
    return unless queryUpdate?
    @config.dataRequester.query ?= {}

    compareQuantile = parseInt(queryUpdate.compareQuantile)
    if compareQuantile >= 0 and compareQuantile <= 100
      @config.dataRequester.query.compareQuantile = compareQuantile
      $("##{@id} .compareQuantile").val(compareQuantile)

  showLoading: ->
    $("##{@id} .loading-icon").fadeIn("fast")

  hideLoading: ->
    $("##{@id} .loading-icon").fadeOut("fast")

  setTitle: ->
    el = $("##{@id}")
    title = @config?.title
    state = $(".compareRegion option:selected").text()
    title = title.replace("{{state}}", state)
    el.find(".chart-title").text(title)

  closeObservers: ->
    for observerKey, observer of @observers
      observer.close()

  destroy: ->
    @closeObservers()
    @dataRequester.destroy()
    $("##{@id}").html("")

window.Ag ?= {}
window.Ag.Chart ?= {}
window.Ag.Chart.Abstract = ChartAbstract
