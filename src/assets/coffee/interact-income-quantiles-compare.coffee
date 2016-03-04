class InteractIncomeQuantilesCompare extends Ag.Interact.Abstract

  constructor: (@chart) ->
    super(@chart)
    el = $("##{@chart.id}")
    template = "/assets/templates/income-quantiles-compare.html"
    $("##{@chart.id}").load(template, null, =>
      @initUi()
    )

  initUi: ->
    super()
    @react(@config.query)
    $("##{@chart.id} #compare .toggle").on("click", (event) =>
      @react({ compare: event.currentTarget.innerText.toLowerCase() })
    )
    $("##{@chart.id} #compareRegion").change((event) =>
      @react({ compareRegion: event.target.value.toUpperCase() })
    )

  getApiUrl: =>
    return "#{@apiUrlBase}income/quantiles"

  fetchData: (callback) =>
    params = []
    url = @getApiUrl()
    query = @config?.query

    compare = query.compare?.toLowerCase()
    switch compare
      when "race"
        params.push("compare=race")
      when "gender", "sex"
        params.push("compare=sex")
      when "age"
        params.push("compare=agegroup")
      when "state"
        params.push("compare=state")

    compareRegion = query.compareRegion?.toUpperCase()
    if compareRegion and compareRegion isnt "US"
      params.push("state=" + compareRegion)

    if params.length
      url += "?" + params.join('&')

    $.ajax({
      dataType: "json"
      url: url
      timeout: 10000
    }).done((data) =>
      return callback(null, data)
    ).fail((err) =>
      return callback(err)
    )

  propagate: (d, el) =>
    return unless @config.connect?
    queryKey = switch @config.query?.compare?.toLowerCase()
      when "race" then "compareRace"
      when "sex", "gender" then "compareSex"
      when "age" then "compareAge"
    $("##{@config.connect}").trigger("interact", { queryKey: d.id })

  react: (queryUpdate) ->
    return unless queryUpdate?
    @config.query ?= {}

    compare = queryUpdate.compare?.toLowerCase()
    if compare in ["overall", "race", "gender", "sex", "age"]
      @config.query.compare = compare
      $("##{@chart.id} #compare .toggles li").removeClass("active")
      $("##{@chart.id} #compare .toggles li .#{compare}").addClass("active")

    compareRegion = queryUpdate.compareRegion?.toUpperCase()
    if compareRegion?
      @config.query.compareRegion = compareRegion
      $("##{@chart.id} #compareRegion").val(compareRegion)

window.Ag ?= {}
window.Ag.Interact ?= {}
window.Ag.Interact.IncomeQuantilesCompare = InteractIncomeQuantilesCompare
