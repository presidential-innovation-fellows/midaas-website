class ChartMap extends Ag.Chart.Abstract

  constructor: (@id, @config) ->
    super(@id, @config)

  initUi: ->
    super()

    if @config.ui?.compare
      $.get("/assets/templates/ui/toggle-compare-multi.html", (html) =>
        $("##{@id} .ui").append(html)
        $("##{@id} #compare .toggles").hide()
        $("##{@id} #compare .nav").on("click", (event) =>
          $("##{@id} #compare .nav").removeClass("active")
          $(event.currentTarget).addClass("active")
          $("##{@id} #compare .toggles").hide()
          selectedNav = event.currentTarget.innerText.toLowerCase()
          if selectedNav is "overall"
            @react({
              compareRace: undefined
              compareGender: undefined
              compareAge: undefined
            })
          else
            $("##{@id} #compare .toggles.#{selectedNav}").show()
        )
        $("##{@id} #compare .toggle").on("click", (event) =>
          selectedNav = $("##{@id} #compare .nav.active").text().toLowerCase()
          selectedTrigger = event.currentTarget.innerText.toLowerCase()
          queryUpdate = {
            compareRace: undefined
            compareGender: undefined
            compareAge: undefined
          }
          switch selectedNav
            when "race"
              queryUpdate.compareRace = selectedTrigger
              @react(queryUpdate)
            when "gender"
              queryUpdate.compareGender = selectedTrigger
              @react(queryUpdate)
            when "age"
              queryUpdate.compareAge = selectedTrigger
              @react(queryUpdate)
            when "overall"
              @react(queryUpdate)
        )
        @react({ compare: @config.dataRequester?.query?.compare })
      )

  initChart: ->
    @showLoading()
    bindElement = "##{@id} .chart"
    @dataRequester.fetchData((err, data) =>
      data = @translateData(data)
      @_chart = d3.geomap.choropleth()
        .geofile('/assets/topojson/USA.json')
        .projection(d3.geo.albersUsa)
        .colors(colorbrewer.Midaas[11])
        .column('Data')
        .unitId('Fips')
        .click((d, el) =>
          @trigger(d.properties.code)
        )
        .scale(800)
        .legend(true)

      d3.select(bindElement)
        .datum(data)
        .call(@_chart.draw, @_chart)

      @hideLoading()
    )

  update: ->
    @showLoading()
    bindElement = "##{@id} .chart"
    @dataRequester.fetchData((err, data) =>
      data = @translateData(data)
      @_chart.data = data
      @_chart.update()
      @hideLoading()
    )

  lookupFips: (state) ->
    return {
      "AL": "01", "AK": "02", "AZ": "04",
      "AR": "05", "CA": "06", "CO": "08",
      "CT": "09", "DE": "10", "DC": "11",
      "FL": "12", "GA": "13", "HI": "15",
      "ID": "16", "IL": "17", "IN": "18",
      "IA": "19", "KS": "20", "KY": "21",
      "LA": "22", "ME": "23", "MD": "24",
      "MA": "25", "MI": "26", "MN": "27",
      "MS": "28", "MO": "29", "MT": "30",
      "NE": "31", "NV": "32", "NH": "33",
      "NJ": "34", "NM": "35", "NY": "36",
      "NC": "37", "ND": "38", "OH": "39",
      "OK": "40", "OR": "41", "PA": "42",
      "RI": "44", "SC": "45", "SD": "46",
      "TN": "47", "TX": "48", "UT": "49",
      "VT": "50", "VA": "51", "WA": "53",
      "WV": "54", "WI": "55", "WY": "56",
      "PR": "72"
    }[state]

  translateData: (data) ->
    delete data.xLabel if data.xLabel?
    delete data.yLabel if data.yLabel?
    dataArr = []
    for state of data
      for group of data[state]
        fips = @lookupFips(state)
        dataArr.push({
          "State": state
          "Data": data[state][group]
          "Fips": "US" + fips
        })
    return dataArr

  react: (queryUpdate) ->
    super(queryUpdate)

    compareRace = queryUpdate.compareRace?.toLowerCase()
    if compareRace in ["asian", "black", "hispanic", "white"]
      @config.dataRequester.query.compareRace = compareRace
      $("##{@id} #compare .toggles li").removeClass("active")
      $("##{@id} #compare .toggle.#{compareRace}").addClass("active")
    else
      @config.dataRequester.query.compareRace = undefined

    compareGender = queryUpdate.compareGender?.toLowerCase()
    if compareGender in ["male", "female"]
      @config.dataRequester.query.compareGender = compareGender
      $("##{@id} #compare .toggles li").removeClass("active")
      $("##{@id} #compare .toggle.#{compareGender}").addClass("active")
    else
      @config.dataRequester.query.compareGender = undefined

    compareAge = queryUpdate.compareAge?.toLowerCase()
    if compareAge in ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]
      @config.dataRequester.query.compareAge = compareAge
      $("##{@id} #compare .toggles li").removeClass("active")
      $("##{@id} #compare .toggle.#{compareAge}").addClass("active")
    else
      @config.dataRequester.query.compareAge = undefined

    @setTitle()

window.Ag ?= {}
window.Ag.Chart ?= {}
window.Ag.Chart.Map = ChartMap
