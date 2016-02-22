class Chart

  showLoading: ->
    $("#{@chartId} #loading-icon").fadeIn("fast")

  hideLoading: ->
    $("#{@chartId} #loading-icon").fadeOut("fast")

  apiUrlBase: "https://brbimhg0w9.execute-api.us-west-2.amazonaws.com/dev/"

  # implement this when Chart is extended
  fetchData: (callback) ->
    err = null
    data = null
    return callback(err, data)

  init: ->
    @showLoading()
    bindElement = "#{@chartId} #chart"
    @fetchData((err, data) =>
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
    @fetchData((err, data) =>
      @_chart.load({
        columns: data
        unload: @_chart.columns
      })
      @hideLoading()
    )

window.Chart = Chart
