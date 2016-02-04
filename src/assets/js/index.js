var midaas = midaas || {};

midaas.indexPage = {

  bindToggles: function() {
    $(".toggle").on("click", function(event){
      midaas.indexPage.togglePerspective(event);
    });
  },

  loadChart: function() {
    var labels = [
      "5%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "95%", "99%"
    ];
    // var data = [[
    //   9000, 10000, 20000, 30000, 50000, 60000, 70000, 125000, 150000, 175000,
    //   200000, 300000
    // ]];

    // fetch data remotely...
    $.getJSON( "https://x0suepap69.execute-api.us-east-1.amazonaws.com/development/income/quantiles", function( data ) {
      dataArr = [];
      for (var d in data) {
        dataArr.push(data[d]);
      }
      midaas.chart.createChart(labels, [dataArr]);
    });

  },

  togglePerspective: function(event) {
    $(".toggles li").removeClass("active");
    $(event.target).addClass("active");
  }
};

$(document).ready(function() {
  midaas.indexPage.bindToggles();
  midaas.indexPage.loadChart();
});
