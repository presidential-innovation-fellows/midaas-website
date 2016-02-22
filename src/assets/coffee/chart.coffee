class Chart

  constructor: (@chartId) ->
    # create the chart holder
    $("#{@chartId}").append("<div id='#{@chartId}_chart'></div>")
    # create the loading icon
    $("#{@chartId}").append("<img id='#{@chartId}_loading' src='/assets/img/loading-ring.svg'/>")

  showLoading: ->
    $("#{@chartId}_loading").fadeIn("fast")

  hideLoading: ->
    $("#{@chartId}_loading").fadeOut("fast")

  # implement this when Chart is extended
  fetchData: (callback) ->
    err = null
    data = null
    return callback(err, data)

  draw: ->
    @showLoading()
    @fetchData((err, data) =>
      @_chart = c3.generate({
        bindto: @chartId
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
      @chart.load({
        columns: data
        unload: @chart.columns
      })
      @hideLoading()
    )

if exports? and exports
  exports.Chart = Chart
else
  window.Chart = Chart
