var midaas = midaas || {};

midaas.indexPage = {

  loadChart: function() {
    var labels = [
      "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "95%",
      "99%", "100%"
    ];

    var data = [[
      9000, 10000, 20000, 30000, 50000, 60000, 70000, 125000, 150000, 175000,
      200000, 300000
    ]];

    midaas.chart.createChart(labels, data);
  },
};

$(document).ready(function() {
  midaas.indexPage.loadChart();
});
