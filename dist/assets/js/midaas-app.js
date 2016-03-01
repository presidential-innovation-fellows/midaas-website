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
      var el, ref, title;
      el = $("#" + this.chart.id);
      title = (ref = this.chart.config) != null ? ref.title : void 0;
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
      this.propagate = bind(this.propagate, this);
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
      this.react(this.config.query);
      $("#" + this.chart.id + " #compare .toggle").on("click", (function(_this) {
        return function(event) {
          return _this.react({
            compare: event.currentTarget.innerText.toLowerCase()
          });
        };
      })(this));
      return $("#" + this.chart.id + " #compareRegion").change((function(_this) {
        return function(event) {
          return _this.react({
            compareRegion: event.target.value.toUpperCase()
          });
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
      compareRegion = (ref3 = this.config) != null ? (ref4 = ref3.query) != null ? (ref5 = ref4.compareRegion) != null ? ref5.toUpperCase() : void 0 : void 0 : void 0;
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
          return callback(null, data);
        };
      })(this)).fail((function(_this) {
        return function(err) {
          return callback(err);
        };
      })(this));
    };

    InteractIncomeQuantilesCompare.prototype.propagate = function(d, el) {
      var queryKey;
      if (this.config.connect == null) {
        return;
      }
      queryKey = (function() {
        var ref, ref1;
        switch ((ref = this.config.query) != null ? (ref1 = ref.compare) != null ? ref1.toLowerCase() : void 0 : void 0) {
          case "race":
            return "compareRace";
          case "sex":
          case "gender":
            return "compareSex";
          case "age":
            return "compareAge";
        }
      }).call(this);
      return $("#" + this.config.connect).trigger("interact", {
        queryKey: d.id
      });
    };

    InteractIncomeQuantilesCompare.prototype.react = function(queryUpdate) {
      var base, compare, compareRegion, ref, ref1, updateChart;
      if (queryUpdate == null) {
        return;
      }
      if ((base = this.config).query == null) {
        base.query = {};
      }
      updateChart = false;
      compare = (ref = queryUpdate.compare) != null ? ref.toLowerCase() : void 0;
      if (compare === "overall" || compare === "race" || compare === "gender" || compare === "sex" || compare === "age") {
        if (this.config.query.compare.toLowerCase() !== compare) {
          updateChart = true;
        }
        this.config.query.compare = compare;
        $("#" + this.chart.id + " #compare .toggles li").removeClass("active");
        $("#" + this.chart.id + " #compare .toggles li ." + compare).addClass("active");
      }
      compareRegion = (ref1 = queryUpdate.compareRegion) != null ? ref1.toUpperCase() : void 0;
      if (compareRegion != null) {
        if (this.config.query.compareRegion.toUpperCase() !== compareRegion) {
          updateChart = true;
        }
        this.config.query.compareRegion = compareRegion;
        $("#" + this.chart.id + " #compareRegion").val(compareRegion);
      }
      if (updateChart) {
        return this.chart.update();
      }
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
  var InteractIncomeQuantileGenderRatio, base,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  InteractIncomeQuantileGenderRatio = (function(superClass) {
    extend(InteractIncomeQuantileGenderRatio, superClass);

    function InteractIncomeQuantileGenderRatio(chart) {
      var el, template;
      this.chart = chart;
      this.fetchData = bind(this.fetchData, this);
      this.getApiUrl = bind(this.getApiUrl, this);
      InteractIncomeQuantileGenderRatio.__super__.constructor.call(this, this.chart);
      el = $("#" + this.chart.id);
      template = "/assets/templates/income-quantile-gender-ratio.html";
      $("#" + this.chart.id).load(template, null, (function(_this) {
        return function() {
          return _this.initUi();
        };
      })(this));
    }

    InteractIncomeQuantileGenderRatio.prototype.initUi = function() {
      var ref, ref1;
      InteractIncomeQuantileGenderRatio.__super__.initUi.call(this);
      $("#" + this.chart.id + " #compareQuantile").val((ref = (ref1 = this.config.query) != null ? ref1.compareQuantile : void 0) != null ? ref : "50");
      return $("#" + this.chart.id + " #compareQuantile").change((function(_this) {
        return function(event) {
          var base;
          if ((base = _this.config).query == null) {
            base.query = {};
          }
          _this.config.query.compareQuantile = event.target.value;
          return _this.chart.update();
        };
      })(this));
    };

    InteractIncomeQuantileGenderRatio.prototype.getApiUrl = function() {
      return this.apiUrlBase + "income/quantiles?compare=state";
    };

    InteractIncomeQuantileGenderRatio.prototype.fetchData = function(callback) {
      var compareQuantile, params, ref, ref1, url;
      params = [];
      url = this.getApiUrl();
      compareQuantile = (ref = this.config) != null ? (ref1 = ref.query) != null ? ref1.compareQuantile : void 0 : void 0;
      if (parseInt(compareQuantile) >= 0 && parseInt(compareQuantile) <= 100) {
        url += "&quantile=" + compareQuantile;
      }
      return $.when($.ajax({
        dataType: "json",
        url: url + "&sex=male",
        timeout: 10000
      }), $.ajax({
        dataType: "json",
        url: url + "&sex=female",
        timeout: 10000
      })).done((function(_this) {
        return function(mResponse, fResponse) {
          var data, fData, mData, quantile, state;
          mData = mResponse[0];
          fData = fResponse[0];
          data = {};
          for (state in mData) {
            for (quantile in mData[state]) {
              if (data[quantile] == null) {
                data[quantile] = {};
              }
              data[quantile][state] = fData[state][quantile] / mData[state][quantile];
            }
          }
          return callback(null, data);
        };
      })(this)).fail((function(_this) {
        return function(err) {
          return callback(err);
        };
      })(this));
    };

    return InteractIncomeQuantileGenderRatio;

  })(Ag.Interact.Abstract);

  if (window.Ag == null) {
    window.Ag = {};
  }

  if ((base = window.Ag).Interact == null) {
    base.Interact = {};
  }

  window.Ag.Interact.IncomeQuantileGenderRatio = InteractIncomeQuantileGenderRatio;

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
      var interact, ref, type;
      interact = (ref = this.config) != null ? ref.interact : void 0;
      type = interact != null ? interact.type : void 0;
      if (type == null) {
        return console.error(new Error("Missing interact.type in Ag config."));
      }
      switch (type) {
        case "IncomeQuantilesCompare":
          return this.interact = new Ag.Interact.IncomeQuantilesCompare(this);
        case "IncomeQuantileGenderRatio":
          return this.interact = new Ag.Interact.IncomeQuantileGenderRatio(this);
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
          data = _this.translateData(data);
          _this._chart = c3.generate({
            bindto: bindElement,
            data: {
              x: "x",
              columns: data,
              type: "bar",
              onclick: function(d, el) {
                return _this.interact.trigger(d, el);
              }
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
          data = _this.translateData(data);
          _this._chart.load({
            columns: data,
            unload: _this._chart.columns
          });
          return _this.hideLoading();
        };
      })(this));
    };

    ChartBar.prototype.translateData = function(data) {
      var dataArr, group, labelArr, seriesArr, xLabel;
      seriesArr = [];
      for (group in data) {
        labelArr = ["x"];
        dataArr = [group];
        for (xLabel in data[group]) {
          labelArr.push(xLabel);
          dataArr.push(data[group][xLabel]);
        }
        seriesArr.push(dataArr);
      }
      return [labelArr].concat(seriesArr);
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
  var ChartMap, base,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ChartMap = (function(superClass) {
    extend(ChartMap, superClass);

    function ChartMap(id, config) {
      var bindElement;
      this.id = id;
      this.config = config;
      ChartMap.__super__.constructor.call(this, this.id, this.config);
      this.showLoading();
      bindElement = "#" + this.id + " .chart";
      this.interact.fetchData((function(_this) {
        return function(err, data) {
          data = _this.translateData(data);
          _this._chart = d3.geomap.choropleth().geofile('/assets/topojson/USA.json').projection(d3.geo.albersUsa).colors(colorbrewer.Greens[9]).column('Data').unitId('Fips').scale(1000).legend(true);
          d3.select(bindElement).datum(data).call(_this._chart.draw, _this._chart);
          return _this.hideLoading();
        };
      })(this));
    }

    ChartMap.prototype.update = function() {
      var bindElement;
      this.showLoading();
      bindElement = "#" + this.id + " .chart";
      return this.interact.fetchData((function(_this) {
        return function(err, data) {
          data = _this.translateData(data);
          _this._chart.data = data;
          _this._chart.update();
          return _this.hideLoading();
        };
      })(this));
    };

    ChartMap.prototype.lookupFips = function(state) {
      return {
        "AL": "01",
        "AK": "02",
        "AZ": "04",
        "AR": "05",
        "CA": "06",
        "CO": "08",
        "CT": "09",
        "DE": "10",
        "DC": "11",
        "FL": "12",
        "GA": "13",
        "HI": "15",
        "ID": "16",
        "IL": "17",
        "IN": "18",
        "IA": "19",
        "KS": "20",
        "KY": "21",
        "LA": "22",
        "ME": "23",
        "MD": "24",
        "MA": "25",
        "MI": "26",
        "MN": "27",
        "MS": "28",
        "MO": "29",
        "MT": "30",
        "NE": "31",
        "NV": "32",
        "NH": "33",
        "NJ": "34",
        "NM": "35",
        "NY": "36",
        "NC": "37",
        "ND": "38",
        "OH": "39",
        "OK": "40",
        "OR": "41",
        "PA": "42",
        "RI": "44",
        "SC": "45",
        "SD": "46",
        "TN": "47",
        "TX": "48",
        "UT": "49",
        "VT": "50",
        "VA": "51",
        "WA": "53",
        "WV": "54",
        "WI": "55",
        "WY": "56",
        "PR": "72"
      }[state];
    };

    ChartMap.prototype.translateData = function(data) {
      var dataArr, fips, group, state;
      dataArr = [];
      for (group in data) {
        for (state in data[group]) {
          fips = this.lookupFips(state);
          dataArr.push({
            "State": state,
            "Data": data[group][state],
            "Fips": "US" + fips
          });
        }
      }
      return dataArr;
    };

    return ChartMap;

  })(Ag.Chart.Abstract);

  if (window.Ag == null) {
    window.Ag = {};
  }

  if ((base = window.Ag).Chart == null) {
    base.Chart = {};
  }

  window.Ag.Chart.Map = ChartMap;

}).call(this);

(function() {
  var Midaas;

  if (window.Ag == null) {
    window.Ag = {};
  }

  Midaas = (function() {
    function Midaas() {
      this.initConfig();
      this.createCharts();
    }

    Midaas.prototype.initConfig = function() {
      var config, configParam, ref;
      configParam = $.url("?midaasConfig");
      if (configParam) {
        config = JSON.parse(decodeURIComponent(configParam));
      } else {
        config = (ref = Ag.config) != null ? ref : {};
      }
      return Ag.config = config;
    };

    Midaas.prototype.createChart = function(id, config) {
      switch (config != null ? config.type : void 0) {
        case "bar":
          return new Ag.Chart.Bar(id, config);
        case "map":
          return new Ag.Chart.Map(id, config);
      }
    };

    Midaas.prototype.createCharts = function() {
      var charts, config, id, ref;
      charts = {};
      ref = Ag.config;
      for (id in ref) {
        config = ref[id];
        charts[id] = this.createChart(id, config);
      }
      return Ag.charts = charts;
    };

    return Midaas;

  })();

  $((function(_this) {
    return function() {
      return new Midaas();
    };
  })(this));

}).call(this);
