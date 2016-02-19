var midaas = midaas || {};

midaas.indexPage = {

  query: {
    toggleLabel: "Overall",
    selectState: "US"
  },

  bindToggles: function() {
    $(".toggle").on("click", function(event){
      var toggleLabel = event.currentTarget.innerText
      midaas.indexPage.query.toggleLabel = toggleLabel;
      midaas.indexPage.updateChart();
      $(".toggles li").removeClass("active");
      $(event.target).addClass("active");
    });
    $("#state-selector").change(function(event){
      var selectState = event.target.value;
      midaas.indexPage.query.selectState = selectState;
      midaas.indexPage.updateChart();
    });
  },

  apiUrl: "https://brbimhg0w9.execute-api.us-west-2.amazonaws.com/dev/income/quantiles",

  fetchData: function(callback) {
    var url = midaas.indexPage.apiUrl;
    var params = [];
    var query = midaas.indexPage.query;

    switch(query.toggleLabel) {
      case "Race":
        params.push("compare=race");
        break;
      case "Gender":
        params.push("compare=sex");
        break;
      case "Age":
        params.push("compare=agegroup");
        break;
      case "Overall":
      default:
        break;
    }

    if(query.selectState && query.selectState !== "US") {
      params.push("state=" + query.selectState);
    }

    if(params.length) {
      url += "?" + params.join("&");
    }

    $.ajax({
        dataType: "json",
        url: url,
        timeout: 10000
    }).done(function(data){
      var seriesArr = [];
      for (var group in data) {
        var labelArr = ['x'];
        var dataArr = [group];
        for(var percentile in data[group]) {
          labelArr.push(percentile);
          dataArr.push(data[group][percentile]);
        }
        seriesArr.push(dataArr);
      }
      return callback(null, [labelArr].concat(seriesArr));
    }).fail(function(err){
      return callback(err)
    });
  },

  loadChart: function() {
    midaas.indexPage.fetchData(function(err, data) {
      if(err) { return midaas.chart.returnError(err); }

      midaas.indexPage.chart = c3.generate({
        bindto: "#chart",
        data: {
            x: 'x',
            columns: data,
            type: 'bar'
        },
        bar: {
            width: {
                ratio: 0.7 // this makes bar width 50% of length between ticks
            }
            // or
            //width: 100 // this makes bar width 100px
        },
        axis : {
            x : {
                type : 'category'
            }
        }
      });

      midaas.indexPage.hideLoadingIcon();

    });
  },

  updateChart: function() {
    midaas.indexPage.showLoadingIcon();

    midaas.indexPage.fetchData(function(err, data) {
      if(err) { return midaas.chart.returnError(err); }

      midaas.indexPage.chart.load({
        columns: data,
        unload: midaas.indexPage.chart.columns
      });

      midaas.indexPage.hideLoadingIcon();
    });

  },

  showLoadingIcon: function() {
    $("#loading-icon").fadeIn("fast");
  },

  hideLoadingIcon: function() {
    $("#loading-icon").fadeOut("fast");
  }
};

$(document).ready(function() {
  midaas.indexPage.bindToggles();
  midaas.indexPage.loadChart();
});
