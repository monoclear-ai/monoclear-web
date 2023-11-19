import React from "react";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });


type ChartProps = {
  // using `interface` is also ok
  [x: string]: any;
};
type ChartState = {
  chartData: any[];
  chartOptions: any;
};

/*
  RadarChart for displaying metrics.

  Uses ApexCharts internally.
  Options:
    chartOptions: ApexOptions - options for chart
    chartData: ApexAxisChartSeries | ApexNonAxisChartSeries - data to display
*/
class RadarChart extends React.Component<ChartProps, ChartState> {
  constructor(props: { chartData: any[]; chartOptions: any }) {
    super(props);

    this.state = {
      chartData: [],
      chartOptions: {},
    };
  }

  componentDidMount() {
    this.setState({
      chartData: this.props.chartData,
      chartOptions: this.props.chartOptions,
    });
  }

  render() {
    return (
      <ReactApexChart
        options={this.state.chartOptions}
        series={this.state.chartData}
        type="radar"
        width="100%"
        height="100%"
      />
    );
  }
}

export default RadarChart;
