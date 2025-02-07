"use client";
import React from "react";


import {
  ChartConfig,
} from "@/components/ui/chart";
import DataPieChartCard from "@/features/home/components/DataPieChartCard";

export default function page() {
  const chartData = [
    {
      title: "CustomerReturn",
      number: 10485,
      fill: "var(--color-CustomerReturn)",
    },
    { title: "OneTime", number: 3058, fill: "var(--color-OneTime)" },
  ];
  const chartConfig = {
    number: {
      label: "number",
    },
    CustomerReturn: {
      label: "Customer return",
      color: "hsl(var(--chart-1))",
    },
    OneTime: {
      label: "One time",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const data = {
    appointment: [
      { title: "Ongoing Appointment", number: 2039 },
      { title: "Transferred Appointment", number: 2049 },
      { title: "Closed Appointment", number: 5465 },
      { title: "Upcoming Appointment", number: 2039 },
    ],
  };

  const chartData2 = [
    { title: "January", number: 186 },
    { title: "February", number: 305 },
    { title: "March", number: 237 },
    { title: "April", number: 73 },
    { title: "May", number: 209 },
    { title: "June", number: 214 },
  ];
  const chartConfig2 = {
    number: {
      label: "number",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;


  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-row gap-4 justify-between flex-wrap">
        {data.appointment.map((item, index) => (
          <DataPieChartCard
            key={index}
            chartType="number"
            NumberData={item.number}
            title={item.title}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-4 justify-between">
        <DataPieChartCard
          chartType="pie"
          chartConfig={chartConfig}
          chartData={chartData}
          title={"Customer Return Rate"}
          className=""
        />
        <DataPieChartCard
          chartType="pie"
          chartConfig={chartConfig}
          chartData={chartData}
          title={"Appointments Type"}
          className="col-span-1"
        />
        <DataPieChartCard
          chartType="bar"
          chartConfig={chartConfig2}
          chartData={chartData2}
          title={"General Appointments Status"}
          className="col-span-2"
        />
      </div>
      <div>
      
      </div>
    </div>
  );
}
