(function() {
  var Chart;

  Chart = (function() {
    function Chart(chartId) {
      this.chartId = chartId;
      $("" + this.chartId).append("<div id='" + this.chartId + "_chart'></div>");
      $("" + this.chartId).append("<img id='" + this.chartId + "_loading' src='/assets/img/loading-ring.svg'/>");
    }

    Chart.prototype.showLoading = function() {
      return $(this.chartId + "_loading").fadeIn("fast");
    };

    Chart.prototype.hideLoading = function() {
      return $(this.chartId + "_loading").fadeOut("fast");
    };

    Chart.prototype.fetchData = function(callback) {
      var data, err;
      err = null;
      data = null;
      return callback(err, data);
    };

    Chart.prototype.draw = function() {
      this.showLoading();
      return this.fetchData((function(_this) {
        return function(err, data) {
          _this._chart = c3.generate({
            bindto: _this.chartId,
            data: {
              x: "x",
              columns: data,
              type: "bar"
            },
            bar: {
              width: {
                ratio: 0.7
              }
            },
            axis: {
              x: {
                type: "category"
              }
            }
          });
          return _this.hideLoading();
        };
      })(this));
    };

    Chart.prototype.update = function() {
      this.showLoading();
      return this.fetchData((function(_this) {
        return function(err, data) {
          _this.chart.load({
            columns: data,
            unload: _this.chart.columns
          });
          return _this.hideLoading();
        };
      })(this));
    };

    return Chart;

  })();

  if ((typeof exports !== "undefined" && exports !== null) && exports) {
    exports.Chart = Chart;
  } else {
    window.Chart = Chart;
  }

}).call(this);
