var midaas = midaas || {};

midaas.indexPage = {

  bindToggles: function() {
    $(".toggle").on("click", function(event){
      midaas.indexPage.togglePerspective(event);
    });
  },

  apiUrl: "https://brbimhg0w9.execute-api.us-west-2.amazonaws.com/dev/income/quantiles",

  fetchData: function(toggleLabel, callback) {
    var url = midaas.indexPage.apiUrl;

    switch(toggleLabel) {
      case "Race":
        url += "?compare=race";
        break;
      case "Gender":
        url += "?compare=sex";
        break;
      case "Age":
        url += "?compare=agegroup";
        break;
      case "Overall":
      default:
        break;
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
    midaas.indexPage.fetchData("Overall", function(err, data) {
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

  updateChart: function(toggleLabel) {
    midaas.indexPage.showLoadingIcon();

    midaas.indexPage.fetchData(toggleLabel, function(err, data) {
      if(err) { return midaas.chart.returnError(err); }

      midaas.indexPage.chart.load({
        columns: data,
        unload: midaas.indexPage.chart.columns
      });

      midaas.indexPage.hideLoadingIcon();
    });

  },

  togglePerspective: function(event) {
    var toggleLabel = event.currentTarget.innerText
    midaas.indexPage.updateChart(toggleLabel);
    $(".toggles li").removeClass("active");
    $(event.target).addClass("active");
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
