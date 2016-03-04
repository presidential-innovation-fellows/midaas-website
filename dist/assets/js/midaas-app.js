(function() {
  var InteractAbstract, base;

  InteractAbstract = (function() {
    InteractAbstract.prototype.apiUrlBase = "https://brbimhg0w9.execute-api.us-west-2.amazonaws.com/dev/";

    function InteractAbstract(chart) {
      var ref;
      this.chart = chart;
      this.config = (ref = this.chart.config) != null ? ref.interact : void 0;
      this.initObservers();
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

    InteractAbstract.prototype.initObservers = function() {
      this.observers = {
        ui: new ObjectObserver(this.config.ui),
        query: new ObjectObserver(this.config.query),
        title: new PathObserver(this.chart.config, "title")
      };
      this.observers.ui.open((function(_this) {
        return function(added, removed, changed, getOldValueFn) {
          return _this.initUi();
        };
      })(this));
      this.observers.query.open((function(_this) {
        return function(added, removed, changed, getOldValueFn) {
          return _this.chart.update();
        };
      })(this));
      return this.observers.title.open((function(_this) {
        return function(title, oldTitle) {
          if (title !== oldTitle) {
            return _this.setTitle();
          }
        };
      })(this));
    };

    InteractAbstract.prototype.closeObservers = function() {
      var observer, observerKey, ref, results;
      ref = this.observers;
      results = [];
      for (observerKey in ref) {
        observer = ref[observerKey];
        results.push(observer.close());
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

    InteractAbstract.prototype.destroy = function() {
      return this.closeObservers();
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
      var compare, compareRegion, params, query, ref, ref1, ref2, url;
      params = [];
      url = this.getApiUrl();
      query = (ref = this.config) != null ? ref.query : void 0;
      compare = (ref1 = query.compare) != null ? ref1.toLowerCase() : void 0;
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
          break;
        case "state":
          params.push("compare=state");
      }
      compareRegion = (ref2 = query.compareRegion) != null ? ref2.toUpperCase() : void 0;
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
      var base, compare, compareRegion, ref, ref1;
      if (queryUpdate == null) {
        return;
      }
      if ((base = this.config).query == null) {
        base.query = {};
      }
      compare = (ref = queryUpdate.compare) != null ? ref.toLowerCase() : void 0;
      if (compare === "overall" || compare === "race" || compare === "gender" || compare === "sex" || compare === "age") {
        this.config.query.compare = compare;
        $("#" + this.chart.id + " #compare .toggles li").removeClass("active");
        $("#" + this.chart.id + " #compare .toggles li ." + compare).addClass("active");
      }
      compareRegion = (ref1 = queryUpdate.compareRegion) != null ? ref1.toUpperCase() : void 0;
      if (compareRegion != null) {
        this.config.query.compareRegion = compareRegion;
        return $("#" + this.chart.id + " #compareRegion").val(compareRegion);
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
  var InteractIncomeQuantileRatio, base,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  InteractIncomeQuantileRatio = (function(superClass) {
    extend(InteractIncomeQuantileRatio, superClass);

    function InteractIncomeQuantileRatio(chart) {
      var el, template;
      this.chart = chart;
      this.fetchData = bind(this.fetchData, this);
      this.getApiUrl = bind(this.getApiUrl, this);
      InteractIncomeQuantileRatio.__super__.constructor.call(this, this.chart);
      el = $("#" + this.chart.id);
      template = "/assets/templates/income-quantile-ratio.html";
      $("#" + this.chart.id).load(template, null, (function(_this) {
        return function() {
          return _this.initUi();
        };
      })(this));
    }

    InteractIncomeQuantileRatio.prototype.initUi = function() {
      var ref, ref1;
      InteractIncomeQuantileRatio.__super__.initUi.call(this);
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

    InteractIncomeQuantileRatio.prototype.getApiUrl = function() {
      return this.apiUrlBase + "income/quantiles";
    };

    InteractIncomeQuantileRatio.prototype.fetchData = function(callback) {
      var compare, compareQuantile, params, paramsDenominator, paramsNumerator, query, ratioDenominator, ratioNumerator, ratioType, ref, ref1, ref2, ref3, ref4, url;
      params = [];
      url = this.getApiUrl();
      query = (ref = this.config) != null ? ref.query : void 0;
      compare = (ref1 = query.compare) != null ? ref1.toLowerCase() : void 0;
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
          break;
        case "state":
          params.push("compare=state");
      }
      compareQuantile = query.compareQuantile;
      if (parseInt(compareQuantile) >= 0 && parseInt(compareQuantile) <= 100) {
        params.push("quantile=" + compareQuantile);
      }
      ratioType = (ref2 = query.ratioType) != null ? ref2.toLowerCase() : void 0;
      ratioNumerator = (ref3 = query.ratioNumerator) != null ? ref3.toLowerCase() : void 0;
      ratioDenominator = (ref4 = query.ratioDenominator) != null ? ref4.toLowerCase() : void 0;
      paramsNumerator = params.concat(ratioType + "=" + ratioNumerator);
      paramsDenominator = params.concat(ratioType + "=" + ratioDenominator);
      return $.when($.ajax({
        dataType: "json",
        url: url + "?" + (paramsNumerator.join('&')),
        timeout: 10000
      }), $.ajax({
        dataType: "json",
        url: url + "?" + (paramsDenominator.join('&')),
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

    return InteractIncomeQuantileRatio;

  })(Ag.Interact.Abstract);

  if (window.Ag == null) {
    window.Ag = {};
  }

  if ((base = window.Ag).Interact == null) {
    base.Interact = {};
  }

  window.Ag.Interact.IncomeQuantileRatio = InteractIncomeQuantileRatio;

}).call(this);

(function() {
  var base, createInteract;

  createInteract = function(chart) {
    var interact, ref, type;
    interact = chart != null ? (ref = chart.config) != null ? ref.interact : void 0 : void 0;
    type = interact != null ? interact.type : void 0;
    if (type == null) {
      return console.error(new Error("Missing interact.type in Ag config."));
    }
    switch (type) {
      case "IncomeQuantilesCompare":
        return new Ag.Interact.IncomeQuantilesCompare(chart);
      case "IncomeQuantileRatio":
        return new Ag.Interact.IncomeQuantileRatio(chart);
    }
  };

  if (window.Ag == null) {
    window.Ag = {};
  }

  if ((base = window.Ag).Interact == null) {
    base.Interact = {};
  }

  window.Ag.Interact.Create = createInteract;

}).call(this);

(function() {
  var ChartAbstract, base;

  ChartAbstract = (function() {
    function ChartAbstract(id, config) {
      this.id = id;
      this.config = config;
      this.initInteract();
      this.initObservers();
      this.initChart();
    }

    ChartAbstract.prototype.initChart = function() {};

    ChartAbstract.prototype.initInteract = function() {
      return this.interact = Ag.Interact.Create(this);
    };

    ChartAbstract.prototype.initObservers = function() {
      this.observers = {
        type: new PathObserver(this.config, "interact.type")
      };
      return this.observers.type.open((function(_this) {
        return function(type, oldType) {
          _this.initInteract();
          return _this.initChart();
        };
      })(this));
    };

    ChartAbstract.prototype.showLoading = function() {
      return $("#" + this.id + " #loading-icon").fadeIn("fast");
    };

    ChartAbstract.prototype.hideLoading = function() {
      return $("#" + this.id + " #loading-icon").fadeOut("fast");
    };

    ChartAbstract.prototype.closeObservers = function() {
      var observer, observerKey, ref, results;
      ref = this.observers;
      results = [];
      for (observerKey in ref) {
        observer = ref[observerKey];
        results.push(observer.close());
      }
      return results;
    };

    ChartAbstract.prototype.destroy = function() {
      this.closeObservers();
      this.interact.destroy();
      return $("#" + this.id).html("");
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
      this.id = id;
      this.config = config;
      ChartBar.__super__.constructor.call(this, this.id, this.config);
    }

    ChartBar.prototype.initChart = function() {
      var bindElement;
      this.showLoading();
      bindElement = "#" + this.id + " .chart";
      return this.interact.fetchData((function(_this) {
        return function(err, data) {
          data = _this.translateData(data);
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
      this.id = id;
      this.config = config;
      ChartMap.__super__.constructor.call(this, this.id, this.config);
    }

    ChartMap.prototype.initChart = function() {
      var bindElement;
      this.showLoading();
      bindElement = "#" + this.id + " .chart";
      return this.interact.fetchData((function(_this) {
        return function(err, data) {
          data = _this.translateData(data);
          _this._chart = d3.geomap.choropleth().geofile('/assets/topojson/USA.json').projection(d3.geo.albersUsa).colors(colorbrewer.Greens[9]).column('Data').unitId('Fips').scale(1000).legend(true);
          d3.select(bindElement).datum(data).call(_this._chart.draw, _this._chart);
          return _this.hideLoading();
        };
      })(this));
    };

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
  var base, createChart;

  createChart = function(id, config) {
    switch (config != null ? config.type : void 0) {
      case "bar":
        return new Ag.Chart.Bar(id, config);
      case "map":
        return new Ag.Chart.Map(id, config);
    }
  };

  if (window.Ag == null) {
    window.Ag = {};
  }

  if ((base = window.Ag).Chart == null) {
    base.Chart = {};
  }

  window.Ag.Chart.Create = createChart;

}).call(this);

(function() {
  var Midaas;

  if (window.Ag == null) {
    window.Ag = {};
  }

  Midaas = (function() {
    Midaas.prototype.charts = {};

    Midaas.prototype.observers = {};

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
      Ag.charts[id] = this.charts[id] = Ag.Chart.Create(id, config);
      this.observers["chart_" + id] = new PathObserver(config, "type");
      return this.observers["chart_" + id].open((function(_this) {
        return function(type, oldType) {
          _this.destroyChart(id);
          return _this.createChart(id, Ag.config[id]);
        };
      })(this));
    };

    Midaas.prototype.destroyChart = function(id) {
      this.observers["chart_" + id].close();
      this.charts[id].destroy();
      delete this.charts[id];
      return delete Ag.charts[id];
    };

    Midaas.prototype.createCharts = function() {
      var config, id, ref;
      Ag.charts = this.charts = {};
      ref = Ag.config;
      for (id in ref) {
        config = ref[id];
        this.createChart(id, config);
      }
      this.observers.charts = new ObjectObserver(Ag.config);
      return this.observers.charts.open((function(_this) {
        return function(added, removed, changed, getOldValueFn) {
          Object.keys(added).forEach(function(id) {
            config = added[id];
            return _this.createChart(id, config);
          });
          return Object.keys(removed).forEach(function(id) {
            config = removed[id];
            return _this.destroyChart(id);
          });
        };
      })(this));
    };

    return Midaas;

  })();

  $((function(_this) {
    return function() {
      return new Midaas();
    };
  })(this));

}).call(this);

(function() {
  var WidgetAbstract, base;

  WidgetAbstract = (function() {
    function WidgetAbstract() {
      return null;
    }

    WidgetAbstract.prototype.addDragClassToBody = function() {
      var body;
      body = document.body;
      return body.className = body.className += " open-widget-attributes";
    };

    WidgetAbstract.prototype.animateCompletionBar = function(draggedElement, widgetId) {
      var completionBar, dataBar, dataType;
      completionBar = widgetId + " .completion-bar";
      dataType = draggedElement.getAttribute("data-type");
      switch (dataType) {
        case "data":
          dataBar = document.querySelector(completionBar + " .data");
          dataBar.className += " complete";
          break;
        case "demographic":
          dataBar = document.querySelector(completionBar + " .demographic");
          dataBar.className += " complete";
          break;
        case "geographic":
          dataBar = document.querySelector(completionBar + " .geographic");
          dataBar.className += " complete";
      }
      return this.checkCompleteness(dataType, widgetId);
    };

    WidgetAbstract.prototype.checkCompleteness = function(dataType, widgetId) {
      var dragItem;
      dragItem = widgetId + " .data-drop .drag-item";
      if ($(dragItem).attr("data-dataset") === "quantiles") {
        return this.closeDrawer(widgetId);
      } else if ($(dragItem).attr("data-dataset") === "ratio") {
        if ($(widgetId + " .demographic-drop .drag-item").length > 0) {
          return this.closeDrawer(widgetId);
        } else {
          return this.openDrawer(widgetId);
        }
      }
    };

    WidgetAbstract.prototype.closeDrawer = function(widgetId) {
      return $(widgetId).addClass("closed");
    };

    WidgetAbstract.prototype.enableDragging = function(el, menuId) {
      var dataDrop, dataMenu, dataType, widgetId;
      widgetId = "#" + el.id;
      dataMenu = document.querySelector(menuId);
      dataType = document.querySelector(menuId + " li").getAttribute("data-type");
      dataDrop = document.querySelector(widgetId + " ." + dataType + "-drop");
      return dragula([dataMenu, dataDrop], {
        copy: true
      }).on('drag', (function(_this) {
        return function(el) {
          _this.addDragClassToBody();
          return el.className = el.className.replace('ex-moved', '');
        };
      })(this)).on('drop', (function(_this) {
        return function(el) {
          _this.removeExistingDrop(dataDrop, el, widgetId);
          _this.animateCompletionBar(el, widgetId);
          _this.removeDragClassFromBody();
          return el.className += ' ex-moved';
        };
      })(this)).on('over', function(el, container) {
        return container.className += ' ex-over';
      }).on('out', function(el, container) {
        return container.className = container.className.replace("ex-over", "");
      });
    };

    WidgetAbstract.prototype.openDrawer = function(widgetId) {
      return $(widgetId).removeClass("closed");
    };

    WidgetAbstract.prototype.removeDragClassFromBody = function() {
      return $("body").removeClass("open-widget-attributes");
    };

    WidgetAbstract.prototype.removeExistingDrop = function(dataDrop, el, widgetId) {
      var dataType;
      dataDrop.className += " full";
      dataType = el.getAttribute("data-type");
      return $(widgetId + widgetId + " ." + dataType + "-drop .ex-moved").remove();
    };

    return WidgetAbstract;

  })();

  if (window.Ag == null) {
    window.Ag = {};
  }

  if ((base = window.Ag).Widget == null) {
    base.Widget = {};
  }

  window.Ag.Widget.Abstract = WidgetAbstract;

}).call(this);

(function() {
  var WidgetChartBar, base,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  WidgetChartBar = (function(superClass) {
    extend(WidgetChartBar, superClass);

    function WidgetChartBar(el) {
      var template;
      template = "/assets/templates/widget-chart-bar.html";
      $(el).load(template, null, (function(_this) {
        return function() {
          _this.enableDragging(el, "#data-menu");
          _this.enableDragging(el, "#demographic-menu");
          return _this.enableDragging(el, "#geographic-menu");
        };
      })(this));
    }

    return WidgetChartBar;

  })(Ag.Widget.Abstract);

  if (window.Ag == null) {
    window.Ag = {};
  }

  if ((base = window.Ag.Widget).ChartBar == null) {
    base.ChartBar = {};
  }

  window.Ag.Widget.ChartBar = WidgetChartBar;

}).call(this);

(function() {
  var Dashboard;

  if (window.Ag == null) {
    window.Ag = {};
  }

  Dashboard = (function() {
    function Dashboard() {
      this.enableDragging();
    }

    Dashboard.prototype.enableDragging = function() {
      var dashContainer, dashContainerWidth, dashMenu, widgetCount;
      dashMenu = document.querySelector("#toolbox-menu");
      dashContainer = document.querySelector("#active-widget-container");
      dashContainerWidth = dashContainer.offsetWidth + "px";
      widgetCount = 0;
      return dragula([dashMenu, dashContainer], {
        copy: true
      }).on('drag', function(el) {
        el.className = el.className.replace('ex-moved', '');
        return $(".gu-mirror").attr("width", dashContainerWidth);
      }).on('drop', (function(_this) {
        return function(el) {
          el.className += ' ex-moved widget';
          widgetCount += 1;
          el.id = "widget-" + widgetCount;
          return _this.initWidget(el);
        };
      })(this)).on('over', function(el, container) {
        return container.className += ' ex-over';
      }).on('out', function(el, container) {
        return container.className = container.className.replace('ex-over', '');
      });
    };

    Dashboard.prototype.initWidget = function(el) {
      var widgetType;
      widgetType = el.getAttribute("data-widget");
      switch (widgetType) {
        case "bar-chart":
          return new Ag.Widget.ChartBar(el);
      }
    };

    return Dashboard;

  })();

  $(function() {
    return new Dashboard();
  });

}).call(this);
