//@ts-nocheck

// Example options for pie chart, PieChart
export const pieChartOptions = {
  labels: ["Your files", "System", "Empty"],
  colors: ["#4318FF", "#6AD2FF", "#EFF4FB"],
  chart: {
    width: "50px",
  },
  states: {
    hover: {
      filter: {
        type: "none",
      },
    },
  },
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  hover: { mode: null },
  plotOptions: {
    donut: {
      expandOnClick: false,
      donut: {
        labels: {
          show: false,
        },
      },
    },
  },
  fill: {
    colors: ["#4318FF", "#6AD2FF", "#EFF4FB"],
  },
  tooltip: {
    enabled: true,
    theme: "dark",
    style: {
      fontSize: "12px",
      fontFamily: undefined,
      backgroundColor: "#000000"
    },
  },
};

// Example data for pie chart, PieChart
export const pieChartData = [63, 25, 12];

// Example data for bar chart, Timely Bar Graphs
export const barChartDataTimelyBarGraphs = [
  {
    name: "PRODUCT A",
    data: [400, 370, 330, 390, 320, 350, 360, 320, 380],
    color: "#6AD2Fa",
  },
  {
    name: "PRODUCT B",
    data: [400, 370, 330, 390, 320, 350, 360, 320, 380],
    color: "#4318FF",
  },
  {
    name: "PRODUCT C",
    data: [400, 370, 330, 390, 320, 350, 360, 320, 380],
    color: "#EFF4FB",
  },
];

// Example options for bar chart, TimelyBarGraphs
export const barChartOptionsTimelyBarGraphs = {
  chart: {
    stacked: true,
    toolbar: {
      show: false,
    },
  },
  // colors:['#ff3322','#faf']
  tooltip: {
    style: {
      fontSize: "12px",
      fontFamily: undefined,
      backgroundColor: "#000000"
    },
    theme: 'dark',
    onDatasetHover: {
      style: {
        fontSize: "12px",
        fontFamily: undefined,
      },
    },
  },
  xaxis: {
    categories: ["17", "18", "19", "20", "21", "22", "23", "24", "25"],
    show: false,
    labels: {
      show: true,
      style: {
        colors: "#A3AED0",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
    color: "black",
    labels: {
      show: false,
      style: {
        colors: "#A3AED0",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
  },

  grid: {
    borderColor: "rgba(163, 174, 208, 0.3)",
    show: true,
    yaxis: {
      lines: {
        show: false,
        opacity: 0.5,
      },
    },
    row: {
      opacity: 0.5,
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  fill: {
    type: "solid",
    colors: ["#5E37FF", "#6AD2FF", "#E1E9F8"],
  },
  legend: {
    show: false,
  },
  colors: ["#5E37FF", "#6AD2FF", "#E1E9F8"],
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: "20px",
    },
  },
};

// Example options for line chart, TimelyLineGraphs
export const lineChartOptions: any = {
  legend: {
    show: false,
  },

  markers: {
    size: 4
  },

  theme: {
    mode: "light",
  },
  chart: {
    type: "line",

    toolbar: {
      show: false,
    },
  },

  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },

  tooltip: {
    style: {
      fontSize: "12px",
      fontFamily: undefined,
      backgroundColor: "#000000"
    },
    theme: 'dark',
    x: {
      format: "yyyy/MM/dd HH:mm",
      show: false,
    },
    custom: function({series, seriesIndex, dataPointIndex, w}) {
      var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
      
      return '<div class="px-2 py-1">' +
      '<ul>' +
      '<li><b>Model</b>: ' + data[2] + '</li>' +
      '<li><b>Score</b>: ' + data[1] + '</li>' +
      '</ul>' +
      '</div>';
    }
  },
  grid: {
    show: false,
  },
  xaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: true,
    },
    labels: {
      style: {
        colors: "#A3AED0",
        fontSize: "12px",
        fontWeight: "500",
      },
      format: "yyyy/MM/dd",
    },
    type: "datetime",
    range: undefined,
  },

  yaxis: {
    show: true,
  },
};

// Example data for radar chart, RadarMetrics
export const radarChartData = [
  {
    name: 'GPT-4',
    data: [4.3, 4.2, 4.5, 4.3, 1, 1, 4.3, 4.2, 4.5, 4.3, 1, 1],
  }, {
    name: 'GPT-3.5',
    data: [4.3, 4.2, 4.5, 4.3, 1, 1, 4.3, 4.2, 4.5, 4.3, 1, 1],
  }, {
    name: 'LLAMA2',
    data: [4.3, 4.2, 4.5, 4.3, 1, 1, 4.3, 4.2, 4.5, 4.3, 1, 1],
  }
];

/* 
  Customizable options for radar chart, RadarMetrics
  
  @param cats: categories for the radar chart
  @param minN: minimum value for the radar chart
  @param maxN: maximum value for the radar chart
  @param tickN: number of ticks for the radar chart
*/
export function radarChartOptions(cats: string[], minN: number, maxN: number, 
                                  tickN: number) {
  return ({
    chart: {
      width: '100%',
      height: '100%',
      type: 'radar',
      dropShadow: {
        enabled: true,
        blur: 1,
        left: 1,
        top: 1
      },
      toolbar: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
    stroke: {
      width: 2
    },
    fill: {
      opacity: 0.1
    },
    markers: {
      size: 0
    },
    xaxis: {
      categories: cats,
    },
    yaxis: {
      min: minN,
      max: maxN,
      tickAmount: tickN,
    }
  });
}