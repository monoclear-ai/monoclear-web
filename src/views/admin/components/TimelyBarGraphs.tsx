import Card from "components/card";
import BarChart from "components/charts/BarChart";
import {
  barChartDataTimelyBarGraphs,
  barChartOptionsTimelyBarGraphs,
} from "variables/charts";
import { MdBarChart } from "react-icons/md";

 // TODO : Fix shape to be similar to TimelyLineGraphs
const TimelyBarGraphs = (props: { 
  title: any,
 }) => {
  const { title } = props;
  return (
    <Card extra="flex flex-col bg-white h-full w-full rounded-3xl py-6 px-2 text-center">
      <div className="mb-auto flex border-2 items-center justify-between px-6">
        <h2 className="text-lg font-bold text-navy-700 dark:text-white">
          {title}
        </h2>
        <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
          <MdBarChart className="h-6 w-6" />
        </button>
      </div>

      <div className="md:mt-16 lg:mt-0">
        <div className="h-[200px] w-full border-2 xl:h-[200px]">
          <BarChart
            chartData={barChartDataTimelyBarGraphs}
            chartOptions={barChartOptionsTimelyBarGraphs}
          />
        </div>
      </div>
    </Card>
  );
};

export default TimelyBarGraphs;
