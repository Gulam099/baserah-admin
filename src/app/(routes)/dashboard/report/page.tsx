"use client";
import React, { useEffect, useState } from "react";
import { ChartConfig } from "@/components/ui/chart";
import DataPieChartCard from "@/features/home/components/DataPieChartCard";
import MapComp from "@/features/report/components/MapComp";
import { SliderPerson } from "@/features/report/components/SliderPerson";
import { fetchPatientReturnStats } from "@/features/report/util/report.util";

export default function page() {
  const [chartData, setChartData] = useState([
    { title: "CustomerReturn", number: 0, fill: "var(--color-CustomerReturn)" },
    { title: "OneTime", number: 0, fill: "var(--color-OneTime)" },
  ]);

  useEffect(() => {
    async function loadStats() {
      const response = await fetchPatientReturnStats();
      if (response.success && response.data) {
        setChartData([
          {
            title: "CustomerReturn",
            number: response.data.returningPatients,
            fill: "var(--color-CustomerReturn)",
          },
          {
            title: "OneTime",
            number: response.data.nonReturningPatients,
            fill: "var(--color-OneTime)",
          },
        ]);
      }
    }
    loadStats();
  }, []);

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

  // mockData.ts

  const mockMapDataPoints: {
    label: string;
    coordinates: [number, number];
    color?: string;
  }[] = [
    {
      label: "New York Office",
      coordinates: [-73.98249, 40.76313],
      color: "#0035d7",
    },
    {
      label: "Sydney Office",
      coordinates: [151.20456, -33.86501],
      color: "#d76270",
    },
    {
      label: "Calgary Office",
      coordinates: [-114.00058, 51.05803],
      color: "#d76270",
    },
    {
      label: "Delhi Office",
      coordinates: [77.32648, 28.61751],
      color: "#0035d7",
    },
    {
      label: "London Office",
      coordinates: [-0.07772, 51.51868],
      color: "#c0a162",
    },
    {
      label: "Singapore (Coming Soon)",
      coordinates: [103.83051, 1.27966],
      color: "#0035d7",
    },
    {
      label: "Saudi Arabia (Coming Soon)",
      coordinates: [45.10309, 23.69665],
      color: "#c0a162",
    },
  ];

  const mockMapLegend = [
    { label: "Satisfied", color: "#0035d7" },
    { label: "Average Satisfaction", color: "#c0a162" },
    { label: "Dissatisfied", color: "#d76270" },
  ];

  const mockSpecialistsData: {
    name: string;
    session: number;
    performance: number;
    image: string;
  }[] = [
    {
      name: "John Doe",
      session: 50,
      performance: 95,
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Jane Smith",
      session: 64,
      performance: 88,
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Michael Johnson",
      session: 72,
      performance: 92,
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Emily Davis",
      session: 58,
      performance: 90,
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Daniel Brown",
      session: 80,
      performance: 97,
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Olivia Wilson",
      session: 45,
      performance: 85,
      image: "https://via.placeholder.com/80",
    },
    {
      name: "William Taylor",
      session: 59,
      performance: 93,
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Isabella Martinez",
      session: 67,
      performance: 91,
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Liam Anderson",
      session: 74,
      performance: 98,
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Sophia Thomas",
      session: 51,
      performance: 89,
      image: "https://via.placeholder.com/80",
    },
  ];

  const chartData3 = [
    {
      month: "January",
      psychiatrist: 186,
      psychologist: 80,
      childPsychologist: 162,
      family: 265,
      external: 100,
    },
    {
      month: "February",
      psychiatrist: 305,
      psychologist: 200,
      childPsychologist: 78,
      family: 180,
      external: 90,
    },
    {
      month: "March",
      psychiatrist: 237,
      psychologist: 120,
      childPsychologist: 34,
      family: 210,
      external: 120,
    },
    {
      month: "April",
      psychiatrist: 73,
      psychologist: 190,
      childPsychologist: 65,
      family: 240,
      external: 150,
    },
    {
      month: "May",
      psychiatrist: 209,
      psychologist: 130,
      childPsychologist: 178,
      family: 88,
      external: 300,
    },
    {
      month: "June",
      psychiatrist: 214,
      psychologist: 140,
      childPsychologist: 238,
      family: 156,
      external: 220,
    },
  ];
  const chartConfig3 = {
    psychiatrist: {
      label: "Psychiatrist",
      color: "hsl(var(--chart-1))",
    },
    psychologist: {
      label: "Psychologist",
      color: "hsl(var(--chart-2))",
    },
    childPsychologist: {
      label: "Child Psychologist",
      color: "hsl(var(--chart-3))",
    },
    family: {
      label: "Family and Marriage Specialist ",
      color: "hsl(var(--chart-4))",
    },
    external: {
      label: "External Customer",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-4 ">
      <h2 className="text-lg font-semibold text-neutral-800">Appointments</h2>
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
          chartConfig={{
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
          }}
          chartData={chartData}
          title={"Customer Return Rate"}
          className="basis-1/5"
        />
        <DataPieChartCard
          chartType="pie"
          chartConfig={chartConfig}
          chartData={chartData}
          title={"Appointments Type"}
          dataTypeTile="Total"
          className="basis-1/5"
        />
        <DataPieChartCard
          chartType="bar"
          chartConfig={chartConfig2}
          chartData={chartData2}
          title={"General Appointments Status"}
          className="basis-2/5"
        />
      </div>
      {/* <div>
        <MapComp
          className="max-w-full"
          title="Customer Satisfaction"
          satisfaction={98}
          comments="23K"
          dataPoints={mockMapDataPoints}
          legend={mockMapLegend}
        />
      </div> */}
      {/* <div>
        <SliderPerson
          title={"Performance Indicators for Specialists"}
          desc={"More than 50 sessions per month, minimum"}
          data={mockSpecialistsData}
          viewMoreLink="/dashboard/report/specialist"
        />
      </div> */}
      <h2 className="text-lg font-semibold text-neutral-800">
        Administrative Statistics
      </h2>
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
          chartType="bar"
          chartConfig={chartConfig2}
          chartData={chartData2}
          title={"Ticket Subject"}
          className="basis-1/4"
        />
        <DataPieChartCard
          chartType="bar"
          chartConfig={chartConfig2}
          chartData={chartData2}
          title={"Ticket Type"}
          className="basis-2/3"
        />
      </div>
      {/* <div>
        <DataPieChartCard
          chartType="line"
          chartConfig={chartConfig3}
          chartData={chartData3}
          title={"User Type"}
        />
      </div> */}
      <div className="flex flex-wrap gap-4 justify-between">
        <DataPieChartCard
          chartType="barV"
          chartConfig={chartConfig2}
          chartData={chartData2}
          title={"New and Open Tickets "}
        />
        <DataPieChartCard
          chartType="pie"
          chartConfig={chartConfig}
          chartData={chartData}
          title={"Customer Return Rate"}
        />
        <DataPieChartCard
          chartType="pie"
          chartConfig={chartConfig}
          chartData={chartData}
          title={"Appointments Type"}
          dataTypeTile="Total"
        />
      </div>
      {/* <div className="flex flex-row gap-4 flex-wrap">
        <SliderPerson
          title={"Performance Indicators for Customer Service Employees"}
          desc={"More than 50 Tickets per Day, Minimum per Day"}
          data={mockSpecialistsData}
          className="basis-2/3"
          viewMoreLink="/dashboard/report/service"
        />
        <DataPieChartCard
          chartType="number"
          NumberData={"24 minutes 05 seconds"}
          title={"Average Resolution"}
          desc={"Average Resolution Time per Hour / Minute"}
          className="basis-1/4"
        />
      </div> */}
    </div>
  );
}
