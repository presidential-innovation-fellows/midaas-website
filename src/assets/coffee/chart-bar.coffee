class ChartBar extends Ag.Chart.Abstract

  constructor: (@id, @config) ->
    super(@id, @config)

  initChart: ->
    @showLoading()
    bindElement = "##{@id} .chart"
    @interact.fetchData((err, data) =>
      data = @translateData(data)
      @_chart = c3.generate({
        bindto: bindElement
        data: {
          x: "x"
          columns: data
          type: "bar"
          onclick: (d, el) =>
            @interact.trigger(d.id)
        }
        bar: {
          width: {
            ratio: 0.7
          }
        }
        axis: {
          x: {
            type: "category"
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
    @interact.fetchData((err, data) =>
      data = @translateData(data)
      @_chart.load({
        columns: data
        unload: @_chart.columns
      })
      @hideLoading()
    )

  translateData: (data) ->
    seriesArr = []
    for group of data
      labelArr = ["x"]
      dataArr = [group]
      for xLabel of data[group]
        labelArr.push(xLabel)
        dataArr.push(data[group][xLabel])
      seriesArr.push(dataArr)
    return [labelArr].concat(seriesArr)

window.Ag ?= {}
window.Ag.Chart ?= {}
window.Ag.Chart.Bar = ChartBar
