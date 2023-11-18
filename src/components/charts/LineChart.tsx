import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from 'apexcharts'

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export type ChartState = {
  chartData: ApexAxisChartSeries | ApexNonAxisChartSeries
  chartOptions: ApexOptions
}

export type ChartProps = ChartState & {
  [x: string]: any
}

interface LineChartProps extends ChartProps {}

export default function LineChart ({
  chartOptions,
  chartData
}: LineChartProps) {
  return (
    <ReactApexChart
      options={chartOptions}
      series={chartData}
      type='line'
      width='100%'
      height='100%'
    />
  )
}
