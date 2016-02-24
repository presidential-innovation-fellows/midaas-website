(function() {
  var Chart;

  Chart = (function() {
    function Chart() {}

    Chart.prototype.showLoading = function() {
      return $(this.chartId + " #loading-icon").fadeIn("fast");
    };

    Chart.prototype.hideLoading = function() {
      return $(this.chartId + " #loading-icon").fadeOut("fast");
    };

    Chart.prototype.apiUrlBase = "https://brbimhg0w9.execute-api.us-west-2.amazonaws.com/dev/";

    Chart.prototype.fetchData = function(callback) {
      var data, err;
      err = null;
      data = null;
      return callback(err, data);
    };

    Chart.prototype.init = function() {
      var bindElement;
      this.setTitle();
      this.showLoading();
      bindElement = this.chartId + " .chart";
      return this.fetchData((function(_this) {
        return function(err, data) {
          _this._chart = c3.generate({
            bindto: bindElement,
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
          _this._chart.load({
            columns: data,
            unload: _this._chart.columns
          });
          return _this.hideLoading();
        };
      })(this));
    };

    return Chart;

  })();

  window.Chart = Chart;

}).call(this);

(function() {
  var ChartCompare,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ChartCompare = (function(superClass) {
    extend(ChartCompare, superClass);

    function ChartCompare(chartId1) {
      var chartEl, chartTemplate, ref, ref1;
      this.chartId = chartId1;
      this.fetchData = bind(this.fetchData, this);
      this.getApiUrl = bind(this.getApiUrl, this);
      chartEl = $(this.chartId);
      this.query = {
        compare: (ref = chartEl.attr('compare')) != null ? ref : "Overall",
        compareRegion: (ref1 = chartEl.attr('compare-region')) != null ? ref1 : "US"
      };
      chartTemplate = "/assets/templates/chart-compare.html";
      $("" + this.chartId).load(chartTemplate, null, (function(_this) {
        return function() {
          _this.setTitle(_this.chartId);
          _this._bindToggles();
          return _this.init();
        };
      })(this));
    }

    ChartCompare.prototype.getApiUrl = function() {
      return this.apiUrlBase + "income/quantiles";
    };

    ChartCompare.prototype.fetchData = function(callback) {
      var params, url;
      params = [];
      url = this.getApiUrl();
      switch (this.query.compare.toLowerCase()) {
        case "race":
          params.push("compare=race");
          break;
        case "gender":
        case "sex":
          params.push("compare=sex");
          break;
        case "age":
          params.push("compare=agegroup");
      }
      if (this.query.compare && this.query.compare === !"US") {
        params.push("state=" + query.compareRegion);
      }
      if (params.length) {
        url += "?" + (params.join('&'));
      }
      return $.ajax({
        dataType: "json",
        url: url,
        timeout: 10000
      }).done((function(_this) {
        return function(data) {
          var dataArr, group, labelArr, percentile, seriesArr;
          seriesArr = [];
          for (group in data) {
            labelArr = ["x"];
            dataArr = [group];
            for (percentile in data[group]) {
              labelArr.push(percentile);
              dataArr.push(data[group][percentile]);
            }
            seriesArr.push(dataArr);
          }
          return callback(null, [labelArr].concat(seriesArr));
        };
      })(this)).fail((function(_this) {
        return function(err) {
          return callback(err);
        };
      })(this));
    };

    ChartCompare.prototype.setTitle = function(chartId) {
      var chartEl, title;
      chartEl = $(this.chartId);
      title = chartEl.attr("title");
      return chartEl.find(".chart-title").text(title);
    };

    ChartCompare.prototype._bindToggles = function() {
      $(this.chartId + " .toggle").on("click", (function(_this) {
        return function(event) {
          _this.query.compare = event.currentTarget.innerText;
          _this.update();
          $(_this.chartId + " .toggles li").removeClass("active");
          return $(event.target).addClass("active");
        };
      })(this));
      return $(this.chartId + " #region-selector").change((function(_this) {
        return function(event) {
          _this.query.region = event.target.value;
          return _this.update();
        };
      })(this));
    };

    return ChartCompare;

  })(Chart);

  window.ChartCompare = ChartCompare;

  $(document).ready((function(_this) {
    return function() {
      return $('.chart-compare').each(function(i) {
        var chartCompare, id;
        id = '#' + $(this).attr('id');
        return chartCompare = new ChartCompare(id);
      });
    };
  })(this));

}).call(this);
