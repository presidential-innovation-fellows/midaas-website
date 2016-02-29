(function() {
  var InteractAbstract, base;

  InteractAbstract = (function() {
    InteractAbstract.prototype.apiUrlBase = "https://brbimhg0w9.execute-api.us-west-2.amazonaws.com/dev/";

    function InteractAbstract(chart) {
      var ref;
      this.chart = chart;
      this.config = (ref = this.chart.config) != null ? ref.interact : void 0;
    }

    InteractAbstract.prototype.initUi = function() {
      var include, ref, ref1, results, uiKey;
      this.setTitle();
      ref1 = (ref = this.config) != null ? ref.ui : void 0;
      results = [];
      for (uiKey in ref1) {
        include = ref1[uiKey];
        if (!include) {
          results.push($("#" + this.chart.id + " #" + uiKey).hide());
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    InteractAbstract.prototype.fetchData = function(callback) {
      var data, err;
      err = null;
      data = null;
      return callback(err, data);
    };

    InteractAbstract.prototype.setTitle = function() {
      var el, title;
      el = $("#" + this.chart.id);
      title = el.attr("title");
      return el.find(".chart-title").text(title);
    };

    return InteractAbstract;

  })();

  if (window.Ag == null) {
    window.Ag = {};
  }

  if ((base = window.Ag).Interact == null) {
    base.Interact = {};
  }

  window.Ag.Interact.Abstract = InteractAbstract;

}).call(this);

(function() {
  var InteractIncomeQuantilesCompare, base,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  InteractIncomeQuantilesCompare = (function(superClass) {
    extend(InteractIncomeQuantilesCompare, superClass);

    function InteractIncomeQuantilesCompare(chart) {
      var el, template;
      this.chart = chart;
      this.fetchData = bind(this.fetchData, this);
      this.getApiUrl = bind(this.getApiUrl, this);
      InteractIncomeQuantilesCompare.__super__.constructor.call(this, this.chart);
      el = $("#" + this.chart.id);
      template = "/assets/templates/income-quantiles-compare.html";
      $("#" + this.chart.id).load(template, null, (function(_this) {
        return function() {
          return _this.initUi();
        };
      })(this));
    }

    InteractIncomeQuantilesCompare.prototype.initUi = function() {
      InteractIncomeQuantilesCompare.__super__.initUi.call(this);
      $("#" + this.chart.id + " #compare .toggle").on("click", (function(_this) {
        return function(event) {
          var base;
          if ((base = _this.config).query == null) {
            base.query = {};
          }
          _this.config.query.compare = event.currentTarget.innerText;
          _this.chart.update();
          $("#" + _this.chart.id + " #compare .toggles li").removeClass("active");
          return $(event.target).addClass("active");
        };
      })(this));
      return $("#" + this.chart.id + " #compareRegion").change((function(_this) {
        return function(event) {
          var base;
          if ((base = _this.config).query == null) {
            base.query = {};
          }
          _this.config.query.compareRegion = event.target.value;
          return _this.chart.update();
        };
      })(this));
    };

    InteractIncomeQuantilesCompare.prototype.getApiUrl = function() {
      return this.apiUrlBase + "income/quantiles";
    };

    InteractIncomeQuantilesCompare.prototype.fetchData = function(callback) {
      var compare, compareRegion, params, ref, ref1, ref2, ref3, ref4, ref5, url;
      params = [];
      url = this.getApiUrl();
      compare = (ref = this.config) != null ? (ref1 = ref.query) != null ? (ref2 = ref1.compare) != null ? ref2.toLowerCase() : void 0 : void 0 : void 0;
      compareRegion = (ref3 = this.config) != null ? (ref4 = ref3.query) != null ? (ref5 = ref4.compareRegion) != null ? ref5.toUpperCase() : void 0 : void 0 : void 0;
      switch (compare) {
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
      if (compareRegion && compareRegion !== "US") {
        params.push("state=" + compareRegion);
      }
      if (params.length) {
        url += "?" + params.join('&');
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

    return InteractIncomeQuantilesCompare;

  })(Ag.Interact.Abstract);

  if (window.Ag == null) {
    window.Ag = {};
  }

  if ((base = window.Ag).Interact == null) {
    base.Interact = {};
  }

  window.Ag.Interact.IncomeQuantilesCompare = InteractIncomeQuantilesCompare;

}).call(this);

(function() {
  var ChartAbstract, base;

  ChartAbstract = (function() {
    function ChartAbstract(id, config) {
      this.id = id;
      this.config = config;
      this.initInteract();
    }

    ChartAbstract.prototype.initInteract = function() {
      var api, interact, ref, ref1;
      interact = (ref = this.config) != null ? ref.interact : void 0;
      api = interact != null ? (ref1 = interact.api) != null ? ref1.toLowerCase() : void 0 : void 0;
      if (api == null) {
        return console.error(new Error("Missing interact.api in Ag config."));
      }
      switch (api) {
        case "income/quantiles?compare":
          return this.interact = new Ag.Interact.IncomeQuantilesCompare(this);
      }
    };

    ChartAbstract.prototype.showLoading = function() {
      return $("#" + this.id + " #loading-icon").fadeIn("fast");
    };

    ChartAbstract.prototype.hideLoading = function() {
      return $("#" + this.id + " #loading-icon").fadeOut("fast");
    };

    return ChartAbstract;

  })();

  if (window.Ag == null) {
    window.Ag = {};
  }

  if ((base = window.Ag).Chart == null) {
    base.Chart = {};
  }

  window.Ag.Chart.Abstract = ChartAbstract;

}).call(this);

(function() {
  var ChartBar, base,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ChartBar = (function(superClass) {
    extend(ChartBar, superClass);

    function ChartBar(id, config) {
      var bindElement;
      this.id = id;
      this.config = config;
      ChartBar.__super__.constructor.call(this, this.id, this.config);
      this.showLoading();
      bindElement = "#" + this.id + " .chart";
      this.interact.fetchData((function(_this) {
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
    }

    ChartBar.prototype.update = function() {
      this.showLoading();
      return this.interact.fetchData((function(_this) {
        return function(err, data) {
          _this._chart.load({
            columns: data,
            unload: _this._chart.columns
          });
          return _this.hideLoading();
        };
      })(this));
    };

    return ChartBar;

  })(Ag.Chart.Abstract);

  if (window.Ag == null) {
    window.Ag = {};
  }

  if ((base = window.Ag).Chart == null) {
    base.Chart = {};
  }

  window.Ag.Chart.Bar = ChartBar;

}).call(this);

(function() {
  var Midaas;

  if (window.Ag == null) {
    window.Ag = {};
  }

  Midaas = (function() {
    function Midaas() {
      this.getConfig();
      this.createCharts();
    }

    Midaas.prototype.getConfig = function() {
      var configParam;
      if (window.Ag.config == null) {
        configParam = $.url("?midaasConfig");
        if (configParam) {
          return this.config = JSON.parse(decodeURIComponent(configParam));
        } else {
          return this.config = {};
        }
      } else {
        return this.config = window.Ag.config;
      }
    };

    Midaas.prototype.createChart = function(id, config) {
      switch (config != null ? config.type : void 0) {
        case "bar":
          return new Ag.Chart.Bar(id, config);
      }
    };

    Midaas.prototype.createCharts = function() {
      var config, id, ref, results;
      this.charts = [];
      ref = this.config;
      results = [];
      for (id in ref) {
        config = ref[id];
        results.push(this.charts.push(this.createChart(id, config)));
      }
      return results;
    };

    return Midaas;

  })();

  $((function(_this) {
    return function() {
      return new Midaas();
    };
  })(this));

}).call(this);
