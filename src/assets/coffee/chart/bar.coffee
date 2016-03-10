class ChartBar extends Ag.Chart.Abstract

  constructor: (@id, @config) ->
    super(@id, @config)

  initUi: ->
    super()

    if @config.ui?.compare
      $.get("/assets/templates/ui/toggle-compare.html", (html) =>
        $("##{@id} .ui").append(html)
        $("##{@id} .compare .toggle").on("click", (event) =>
          @react({ compare: $(event.target).text().toLowerCase()})
        )
        @react({ compare: @config.dataRequester?.query?.compare })
      )

    if @config.ui?.compareRegion
      $.get("/assets/templates/ui/select-compare-region.html", (html) =>
        $("##{@id} .ui").append(html)
        $("##{@id} .compareRegion").change((event) =>
          @react({ compareRegion: $(event.target).text().toUpperCase() })
        )
        @react({ compareRegion: @config.dataRequester?.query?.compareRegion })
      )

  initChart: ->
    @showLoading()
    bindElement = "##{@id} .chart"
    @dataRequester.fetchData((err, data) =>
      xLabel = data.xLabel
      yLabel = data.yLabel
      data = @translateData(data)
      @_chart = c3.generate({
        bindto: bindElement
        data: {
          x: "x"
          columns: data
          type: "bar"
          onclick: (d, el) =>
            @trigger(d.id)
        }
        bar: {
          width: {
            ratio: 0.7
          }
        }
        axis: {
          x: {
            label: "Percentiles"
            type: "category"
          }
          y: {
            label: yLabel
          }
        }
        color: {
          pattern: ["#0071bc", "#fdb81e", "#02bfe7", "#2e8540", "#e31c3d", "#4c2c92"]
        }
      })
      @hideLoading()
    )

  update: ->
    @showLoading()
    @dataRequester.fetchData((err, data) =>
      data = @translateData(data)
      @_chart.load({
        columns: data
        unload: @_chart.columns
      })
      @hideLoading()
    )

  translateData: (data) ->
    delete data.xLabel if data.xLabel?
    delete data.yLabel if data.yLabel?
    seriesArr = []
    for group of data
      labelArr = ["x"]
      dataArr = [group]
      for xLabel of data[group]
        labelArr.push(xLabel)
        dataArr.push(data[group][xLabel])
      seriesArr.push(dataArr)
    return [labelArr].concat(seriesArr)

  react: (queryUpdate) ->
    super(queryUpdate)

    compare = queryUpdate.compare?.toLowerCase()
    if compare in ["overall", "race", "gender", "sex", "age"]
      @config.dataRequester.query.compare = compare
      $("##{@id} .compare .toggles li").removeClass("active")
      $("##{@id} .compare .toggles li.#{compare}").addClass("active")

    compareRegion = queryUpdate.compareRegion?.toUpperCase()
    if compareRegion?
      @config.dataRequester.query.compareRegion = compareRegion
      $("##{@id} .compareRegion").val(compareRegion)

    @setTitle()

window.Ag ?= {}
window.Ag.Chart ?= {}
window.Ag.Chart.Bar = ChartBar
