import RadarChart from "components/charts/RadarChart";
import { radarChartData, radarChartOptions } from "variables/charts";
import Card from "components/card";
import { MdQuestionMark } from "react-icons/md";
import { DataWrapperForViz } from "utils/utils";

/*
  Radar chart for displaying metrics.

  Uses ApexCharts internally.
  Options:
    title: string - title of chart
    metricNames: string[] - names of metrics
    metricData: any - data to display
    minVal: number - minimum value of metric
    maxVal: number - maximum value of metric
    stepCnt: number - number of steps between min and max
*/
export default function RadarMetrics(props: {
    title: string;
    metricNames: string[];
    metricData: any;
    minVal: number;
    maxVal: number;
    stepCnt: number;
}) {
    console.log("********INIT********")
    console.log("RadarMetrics props = " + JSON.stringify(props))
    const { title, metricNames, metricData, minVal, maxVal, stepCnt } = props;
    const radarData = DataWrapperForViz.wrapDataForRadar(metricData)
    const radarOptions = radarChartOptions(metricNames, minVal, maxVal, stepCnt)

    return (
        <Card extra="!p-[20px] h-[300px] text-center">
            <div className="relative flex items-center justify-between">
                <h2 className="text-xl font-bold text-navy-700 dark:text-white">
                    {title}
                </h2>
                <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
                    <MdQuestionMark className="h-6 w-6" />
                </button>
            </div>

            <div className="mt-0">
                <div className="h-[240px] w-full">
                    <RadarChart 
                        chartOptions={radarOptions} 
                        chartData={radarData} />
                </div>
            </div>
        </Card>
    );
}