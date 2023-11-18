import RadarChart from "components/charts/RadarChart";
import { radarChartData, radarChartOptions } from "variables/charts";
import Card from "components/card";
import { MdQuestionMark } from "react-icons/md";
import { DataWrapperForViz } from "utils/utils";

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

    // const radarData = [
    //     {name: "model", data: [1.0, 2.0, 3.0]},
    // ]
    // const radarOptions = radarChartOptions(["haerae_hi", "haerae_kgk", "haerae_sn"], 0.0, 4.0, 1.0)

    return (
        <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
            <div className="mb-auto flex items-center justify-between px-6">
                <h2 className="text-xl font-bold text-navy-700 dark:text-white">
                    {title}
                </h2>
                <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
                    <MdQuestionMark className="h-6 w-6" />
                </button>
            </div>

            <div className="md:mt-16 lg:mt-0">
                <div className="h-[210px] w-full">
                    <RadarChart 
                        chartOptions={radarOptions} 
                        chartData={radarData} />
                </div>
            </div>
        </Card>
    );
}