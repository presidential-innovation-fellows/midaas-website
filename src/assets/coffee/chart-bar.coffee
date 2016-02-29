class ChartBar extends Ag.Chart.Abstract

  constructor: (@id, @config) ->
    super(@id, @config)
    @showLoading()
    bindElement = "##{@id} .chart"
    @interact.fetchData((err, data) =>
      @_chart = c3.generate({
        bindto: bindElement
        data: {
          x: "x"
          columns: data
          type: "bar"
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
      })
      @hideLoading()
    )

  update: ->
    @showLoading()
    @interact.fetchData((err, data) =>
      @_chart.load({
        columns: data
        unload: @_chart.columns
      })
      @hideLoading()
    )

window.Ag ?= {}
window.Ag.Chart ?= {}
window.Ag.Chart.Bar = ChartBar
