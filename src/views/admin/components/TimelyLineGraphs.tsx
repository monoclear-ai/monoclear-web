import {
    MdBarChart,
} from "react-icons/md";
import Card from "components/card";
import {
lineChartOptions,
} from "variables/charts";
import LineChart from "components/charts/LineChart";
import { DataWrapperForViz } from "utils/utils";
import React from "react";
import CheckTable from "./CheckTable";

/*
    Line graph for displaying metrics.
    
    Uses ApexCharts internally.
    title: string - title of chart
    metricName: string - name of metric
    metricData: any - data to display
    currentMetric: any - current metric
    customTags: string[] - custom tags to display
    metricColumns: string[] - columns to display, other columns are ignored.
*/
export default function TimelyLineGraphs(props: { 
    title: string;
    metricName: string;
    metricData: any;
    currentMetric: any;
    detailData:any;
    detailColumns: any;
    metricColumns: string[];
 }) {
    const { title, metricData, metricName, currentMetric, metricColumns, detailData, detailColumns } = props;
    const lastDate = currentMetric ? new Date(currentMetric[0]).toLocaleDateString('en-ZA', {year: 'numeric', month: '2-digit', day: '2-digit'}) : "N/A"

    const lastScore = currentMetric ? currentMetric[1] : "N/A"

    // Togglable detail mode.
    const [detailMode, setDetailMode] = React.useState(false);

    const selectData = []
    for (let i = 0; i < metricData.length; i++) {
        const metric = metricData[i]
        if ((metricColumns.length == 0 && metric.tag.includes("_overall")) || metricColumns.includes(metric.tag) ) {
            selectData.push(metric)
        }
    }
    console.log("metricData = " + JSON.stringify(selectData))
    
    const lineData = DataWrapperForViz.wrapDataForLine(selectData)
    
return (
    <Card extra="!p-[20px] text-center">
        <header className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
            {title}
        </div>
        <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10"
                onClick={() => setDetailMode(!detailMode)}>
            <MdBarChart className="h-6 w-6" />
        </button>
        </header>

        {!detailMode ? (
        <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
            <div className="flex flex-col">
            <p className="mt-[20px] text-3xl font-bold text-navy-700 dark:text-white">
                {lastScore != "N/A" ? lastScore : "N/A"}
            </p>
            <div className="flex flex-col items-center">
                <p className="mt-2 text-sm text-gray-600">{metricName}</p>
                <div className="flex flex-row items-center justify-center">
                <p className="text-sm font-bold text-navy-700"> {lastDate} </p>
                </div>
            </div>
            </div>
            <div className="h-full w-full">
            <LineChart
                chartOptions={lineChartOptions}
                chartData={lineData}
            />
            </div>
        </div>

        ) : (
            <CheckTable title={""} 
            tableColumns={detailColumns} tableData={detailData} 
            headless={true} />
        )
        }
    </Card>
);
};