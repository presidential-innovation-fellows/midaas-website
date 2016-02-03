var midaas = midaas || {};

midaas.chart = {

  addGrayBars: function(chart) {
    var parentId = "#" + chart.svg._node.parentElement.id;

    console.log(parentId);
    $("" + parentId + " .ct-series .ct-bar").each(function() {
      var x = $(this).attr("x1"),
          y = $(this).attr("y1"),
          y2 = 10;

      chart.svg.querySelector(".ct-series").elem("line", {
        x1: x,
        x2: x,
        y1: y,
        y2: y2
      }, "gray-line", true);
    });
  },

  addStrokeWidth: function(data) {
    if(data.type === "bar") {
      data.element.attr({
        style: "stroke-width: 15px"
      });
    }
  },

  createChart: function(labels, chartId, data) {
    var chart = new Chartist.Bar(chartId, {
      labels: labels,
      series: data
      }, {
        axisX: { showLabel: true, showGrid: false },
        axisY: {
          showLabel: true,
          showGrid: false,
          labelInterpolationFnc: function(value) {
            return midaas.formatMoney.toDollars(value);
          }
        },
        chartPadding: { left: 15, top: 10, right: -10 },
        fullWidth: true,
        height: "320px",
        low: 0,
    });

    chart.on("draw", function(context) {
      midaas.chart.addStrokeWidth(context);
    });

    chart.on("created", function(createdChart) {
      midaas.chart.addGrayBars(createdChart);
    });

    return chart;
  }
};
