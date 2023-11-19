import Admin from "layouts/admin";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import Widget from "components/widget/Widget";
import MultiSelect from "components/multiSelect/multiSelect";
import { MdBarChart } from "react-icons/md";
import TimelyLineGraphs from "views/admin/components/TimelyLineGraphs";
import RadarMetrics from "views/admin/components/RadarMetrics";
import CheckTable from "views/admin/components/CheckTable";
import { Deduplicator } from "utils/utils";

/*
  Korean Performance Dashboard page.

  Consists of 3 parts:
  1. Score Trends
  2. Wrong Samples
  3. Deep Analysis

  The data is dynamically fetched from the backend, which is uploaded with the SDK.
  Model & task selection is supported via 2 MultiSelects.

  Supports analyzing up to 3 tasks.
  Supports selecting 3 models.
*/
export default function PerfKoDashboard() {
  const { data: session, update } = useSession()

  const [defaultDisplay, setDefaultDisplay] = React.useState([{
    tag: "haerae_hi",
    values: [[new Date('01 Aug 2023').getTime(), 50, "model1"],]},
  {
    tag: "haerae_kgk", 
    values: [[new Date('01 Aug 2023').getTime(), 20, "model1"],]},
  {
    tag: "haerae_lw", 
    values: [[new Date('01 Aug 2023').getTime(), 30, "model1"],]},
  {
    tag: "haerae_rc", 
    values: [[new Date('01 Aug 2023').getTime(), 25, "model1"],]},
  {
    tag: "haerae_rw", 
    values: [[new Date('01 Aug 2023').getTime(), 55, "model1"],]},
  {
    tag: "haerae_sn", 
    values: [[new Date('01 Aug 2023').getTime(), 65, "model1"],]},
  ]);

  const [filteredDisplay, setFilteredDisplay] = React.useState(defaultDisplay)

  const [firstDisplay, setFirstDisplay] = React.useState(filteredDisplay)
  const [secondDisplay, setSecondDisplay] = React.useState(filteredDisplay)
  const [thirdDisplay, setThirdDisplay] = React.useState(filteredDisplay)

  const [filteredData, setFilteredData] = React.useState(
    [new Date('01 Aug 2023').getTime(), 65, "model1"])

  const [firstTitle, setFirstTitle] = React.useState(
    "");

  const [secondTitle, setSecondTitle] = React.useState(
    "");

  const [thirdTitle, setThirdTitle] = React.useState(
    "");

  const [firstData, setFirstData] = React.useState(
    [new Date('01 Jan 2023').getTime(), 10, "model1"]);

  const [secondData, setSecondData] = React.useState(
    [new Date('01 Jan 2023').getTime(), 20, "model1"]);

  const [thirdData, setThirdData] = React.useState(
    [new Date('01 Jan 2023').getTime(), 30, "model1"]);
  
  const [firstAnalysisTitle, setFirstAnalysisTitle] = React.useState(
    ""
  );

  const [secondAnalysisTitle, setSecondAnalysisTitle] = React.useState(
    ""
  );

  const [thirdAnalysisTitle, setThirdAnalysisTitle] = React.useState(
    ""
  );

  const [firstAnalysisNames, setFirstAnalysisNames] = React.useState(
    ["HI", "GK", "LW", "RC", "RW", "SN"]);

  const [secondAnalysisNames, setSecondAnalysisNames] = React.useState(
    ["HI", "GK", "LW", "RC", "RW", "SN"]);

  const [thirdAnalysisNames, setThirdAnalysisNames] = React.useState(
    ["HI", "GK", "LW", "RC", "RW", "SN"]);
        
  const sampleNames = ["Model", "Category", "No", "Prompt", "Response", "Truth"]

  const [sampleData, setSampleData] = React.useState(
    [{"Model": "model1",
      "Category" : "Science",
      "No" : "3",
      "Prompt" : "Relativitiy Year?", 
      "Response" : "2010",
      "Truth" : "1905",
      "Correct": "X"}]
  )

  const [taskList, setTaskList] = React.useState(
    []
  )

  const [selectedTaskList, setSelectedTaskList] = React.useState(
    []
  )

  const [modelList, setModelList] = React.useState(
    []
  )

  const [selectedModelList, setSelectedModelList] = React.useState(
    []
  )

  // TODO : Use createLineRanks in leaderboard_all.tsx
  // TODO : Detail Ranks
  // TODO : Interactive Model Selection
  useEffect(() => {
    console.log("***********SESSION UPDATE ************")
    console.log(session)
    const eval_details = session?.eval_details
    if (eval_details) {
      console.log(eval_details)
      const model_tags = eval_details.model_tags
      const submit_dates = eval_details.submit_dates
      const sample_links = eval_details.sample_links

      const min_length = Math.min(model_tags.length, submit_dates.length)
      if (model_tags.length != submit_dates.length) {
        console.log("ERROR: model_tags and submit_dates are not the same length : " + model_tags.length + " vs " + submit_dates.length)
      }
      var display = []
      // Parsing the data for default display.
      var res_sample_link = ""
      const lines = {}
      for (var i = 0; i < min_length; i++) {
        console.log("model_tags[" + i + "] = " + model_tags[i])
        console.log("submit_dates[" + i + "] = " + submit_dates[i])
        console.log("sample_links[" + i + "] = " + sample_links[i])
        console.log("metrics[" + i + "] = " + JSON.stringify(eval_details.perf_score[model_tags[i]]))
        const orig_tag = model_tags[i]
        setModelList(oldList => Deduplicator.deduplicate([...oldList, orig_tag]))
        const viz_tag = orig_tag
        // TODO : Fix this.
        // if (orig_tag.includes("__")) {
        //   const viz_tag = orig_tag.split("__", 2)[1]
        // } else {
        //   const viz_tag = orig_tag
        // }
        const viz_date = submit_dates[i]
        const sample_link = sample_links[i]
        const task_scores = eval_details.perf_score[orig_tag]

        for (const task in task_scores) {
          const scores = task_scores[task]
          setTaskList(oldList => Deduplicator.deduplicate([...oldList, task]))
          console.log("scores = " + JSON.stringify(scores))
          for (const task_key in scores) {
            const output = [new Date(viz_date).getTime(), 
              (scores[task_key].toFixed(2) * 100).toFixed(0),
              viz_tag,]
            const line = lines[task_key] || {tag: task_key, values: [], sample_links: []}
            line.values.push(output)
            line.sample_links.push(sample_link)
            lines[task_key] = line
          }
        }
      }
      display = Object.values(lines)
      console.log("*****LINES*****" + JSON.stringify(lines))
      // TODO : Filtering based on the selections.

      console.log("defaultDisplay = " + JSON.stringify(display))
      setDefaultDisplay(display)
      setFilteredDisplay(display)

      setSelectedTaskList(taskList)
      setSelectedModelList(modelList)
    }
  }, [session])

  useEffect(() => {
    console.log("***********FILTER UPDATE ************")
    console.log("selectedTaskList = " + JSON.stringify(selectedTaskList))
    console.log("selectedModelList = " + JSON.stringify(selectedModelList))
    console.log("defaultDisplay = " + JSON.stringify(defaultDisplay))
    var updated = {}
    for (var i = 0; i < defaultDisplay.length; i++) {
      const metric = defaultDisplay[i]
      const tag = metric.tag
      const task_tag = tag.split('_')[0]
      const values = metric.values
      const sample_links = metric.sample_links
      console.log("tag = " + task_tag)
      console.log("values = " + JSON.stringify(values))
      if (!selectedTaskList.includes(task_tag)) {
        continue
      }
      for (var j = 0; j < values.length; j++) {
        const value = values[j]
        const sample_link = sample_links[j]
        if (!selectedModelList.includes(value[2])) {
          continue
        }
        const filtered = updated[tag] || {tag: tag, values: [], sample_links: []}
        filtered.values.push(value)
        filtered.sample_links.push(sample_link)
        updated[tag] = filtered
      }
    }
    const analysis = {}
    const overalls = []

    var latest = [0, 0, "model1"]

    for (const tag in updated) {
      const filtered = updated[tag]
      const task_tag = tag.split('_')[0]
      console.log("filtered = " + JSON.stringify(filtered))
      const values = filtered.values
      const sample_links = filtered.sample_links
      if (!tag.includes("_overall")) {
        analysis[task_tag] = analysis[task_tag] || []
        analysis[task_tag].push(filtered)
      } else {
        overalls.push([task_tag, values[values.length - 1][1], sample_links[sample_links.length - 1]])
        const cur_date = values[values.length - 1]
        if (latest[0] < cur_date[0]) {
          latest = cur_date
        }
      }
    }
    
    // Highest number and corresponding date for now.
    setFilteredData(latest)
    
    console.log("overalls = " + JSON.stringify(overalls))
    const sample_links = []
    console.log("analysises = " + JSON.stringify(analysis))
    if (overalls.length > 0) {
      const first = overalls[0][0]
      setFirstTitle(`${first.toUpperCase()} Score`)
      setFirstData(overalls[0])
      if (analysis[first] !== undefined) {
        console.log("**** SET TRIGGERED ****")
        setFirstAnalysisTitle(`${first.toUpperCase()} Analysis`)
        setFirstDisplay(analysis[first])
        setFirstAnalysisNames(analysis[first].map(x => x.tag.split('_')[1].toUpperCase()))
      } else {
        setFirstAnalysisTitle("")
      }
      sample_links.push(overalls[0][2])
    } else {
      setFirstTitle("")
      setFirstAnalysisTitle("")
    }
    if (overalls.length > 1) {
      const second = overalls[1][0]
      setSecondTitle(`${second.toUpperCase()} Score`)
      setSecondData(overalls[1])
      if (analysis[second] !== undefined) {
        setSecondAnalysisTitle(`${second.toUpperCase()} Analysis`)
        setSecondAnalysisNames(analysis[second].map(x => x.tag.split('_')[1].toUpperCase()))
        setSecondDisplay(analysis[second])
      } else {
        setSecondAnalysisTitle("")
      }
      sample_links.push(overalls[1][2])
    } else {
      setSecondTitle("")
      setSecondAnalysisTitle("")
    }
    if (overalls.length > 2) {
      const third = overalls[2][0]
      setThirdTitle(`${third.toUpperCase()} Score`)
      setThirdData(overalls[2])
      setThirdAnalysisTitle(`${third.toUpperCase()} Analysis`)
      if (analysis[third] !== undefined) {
        setThirdAnalysisNames(analysis[third].map(x => x.tag.split('_')[1].toUpperCase()))
        setThirdDisplay(analysis[third])
      } else {
        setThirdAnalysisTitle("")
      }
      sample_links.push(overalls[2][2])
    } else {
      setThirdTitle("")
      setThirdAnalysisTitle("")
    }

    // Display setting
    updated = Object.values(updated)
    console.log("updated = " + JSON.stringify(updated))
    setFilteredDisplay(updated)

    // Sample Fetching
    async function fetchSamples(link: string) {
      const url = `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${link}`
      console.log(`****fetching****${url}`)
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-control': 'no-store'
        }
      })
      const data = await res.json()
      console.log(data)
      return data?.samples
    }
    setSampleData([])
    for (var i = 0; i < sample_links.length; i++) {
      const sample_link = sample_links[i]
      const model_tag = sample_link.split('/')[sample_link.split('/').length - 2]
      console.log("Sample API Call for " + model_tag + " : " + sample_link)
      fetchSamples(sample_link)
        .then((samples) => {
          for (var j = 0; j < samples.length; j++) {
            samples[j]["Model"] = model_tag
          }
          console.log(samples)
          setSampleData([...sampleData, ...samples])
        })
    }
  }, [selectedTaskList, selectedModelList])

  return (
    <Admin>
      {/* Card widget */}
      {/* TODO : Dynamically extending score */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        {firstTitle ? 
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={firstTitle}
          subtitle={`${firstData[1]}`}
        /> : null}
        {secondTitle ?
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={secondTitle}
          subtitle={`${secondData[1]}`}
        /> : null}
        {thirdTitle ?
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={thirdTitle}
          subtitle={`${thirdData[1]}`}
        /> : null}

        <div className="grid gap-1">
          <MultiSelect 
          formFieldName={"task"}
          prompt={"Tasks"}
          options={taskList}
          onChange={(x) => setSelectedTaskList(x)}
          />
          <MultiSelect
            formFieldName={"model"}
            prompt={"Models"}
            options={modelList}
            onChange={(x) => setSelectedModelList(x)}
          />
        </div>
      </div>

      {/* Charts */}
      
      <div className="mt-5 h-[300px] grid gap-5 grid-cols-2">
        <TimelyLineGraphs title="Score Trends"
        metricData={filteredDisplay}
        metricName="Latest" currentMetric={filteredData} 
        metricColumns={[]}
        detailData={undefined} detailColumns={undefined} />
        {/* Traffic chart & Pie Chart */}
        {/* TODO : Dynamically extending charts */}
        <CheckTable title="Wrong Samples"
          tableColumns={sampleNames}
          tableData={sampleData}
          headless={false}/>
      </div>
      
      <div className="mt-5 h-[300px] grid gap-5 grid-cols-3">

      {firstAnalysisTitle ?
        <RadarMetrics title={firstAnalysisTitle}
          metricData={firstDisplay}
          metricNames={firstAnalysisNames}
          minVal={0}
          maxVal={100}
          stepCnt={4} /> : null}

      {secondAnalysisTitle ?
        <RadarMetrics title={secondAnalysisTitle}
            metricData={secondDisplay}
            metricNames={secondAnalysisNames}
            minVal={0}
            maxVal={100}
            stepCnt={4} /> : null}

      {thirdAnalysisTitle ?
        <RadarMetrics title={thirdAnalysisTitle}
          metricData={thirdDisplay}
          metricNames={thirdAnalysisNames}
          minVal={0}
          maxVal={100}
          stepCnt={4} /> : null}
      </div>
    </Admin>
  );
};