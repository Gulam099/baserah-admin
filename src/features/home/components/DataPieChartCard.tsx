"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { ExportCurve } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Props for the chart card
interface DataChartCardProps {
  chartType: "pie" | "bar" | "barV" | "number" | "line";
  barVertical?: boolean;
  chartConfig?: ChartConfig;
  chartData?: any[];
  title: string;
  desc?: string;
  dataTypeTile?: string;
  NumberData?: number | string;
  className?: string;
  link?: string;
}

export default function DataPieChartCard({
  chartType,
  chartConfig,
  chartData = [],
  title,
  desc,
  dataTypeTile,
  NumberData,
  className,
  link,
}: DataChartCardProps) {

  // Calculate total from chart data (if needed for the pie label)
  const totalVisitors = React.useMemo(() => {
    if (!chartData?.length) return 0;
    return chartData.reduce((acc, curr) => acc + (curr.number ?? 0), 0);
  }, [chartData]);

  // Function that returns the appropriate chart based on `chartType`
  function renderChart() {
    switch (chartType) {
      case "pie":
        return (
          <ChartContainer
            config={chartConfig!}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="number"
                nameKey="title"
                innerRadius={60}
                strokeWidth={5}
              >
                {dataTypeTile && (
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {totalVisitors?.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Visitors
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                )}
              </Pie>
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        );

      case "bar":
        return (
          <div className=" p-4  flex flex-col gap-2">
            {/* <h3 className="text-base font-semibold text-neutral-800">
              {title}
            </h3> */}
            <ChartContainer config={chartConfig!} className="mx-auto max-h-[250px] w-full">
              <BarChart data={chartData} barCategoryGap={30}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="title"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="number"
                  radius={8}
                  barSize={24}
                  fillOpacity={1}
                  isAnimationActive={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>


          </div>
        );

      case "barV":
        return (
          <ChartContainer
            config={chartConfig!}
            className="mx-auto max-h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                right: 16,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="title"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey="number" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar
                dataKey="number"
                layout="vertical"
                fill="var(--color-number)"
                radius={4}
              >
                <LabelList
                  dataKey="number"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        );

      case "line":
        return (
          <ChartContainer
            config={chartConfig!}
            className="mx-auto max-h-[250px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              {/* Example lines - adjust dataKeys as needed */}
              <Line
                dataKey="psychiatrist"
                type="monotone"
                stroke="var(--color-psychiatrist)"
                strokeWidth={2}
              />
              <Line
                dataKey="psychologist"
                type="monotone"
                stroke="var(--color-psychologist)"
                strokeWidth={2}
              />
              <Line
                dataKey="childPsychologist"
                type="monotone"
                stroke="var(--color-childPsychologist)"
                strokeWidth={2}
              />
              <Line
                dataKey="family"
                type="monotone"
                stroke="var(--color-family)"
                strokeWidth={2}
              />
              <Line
                dataKey="external"
                type="monotone"
                stroke="var(--color-external)"
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        );

      case "number":
        return (
          <div className="flex justify-center items-center py-10">
            <p className="text-2xl font-semibold">{NumberData}</p>
          </div>
        );

      default:
        return null;
    }
  }
  const router = useRouter();

  function handleCardClick() {
    if (link) {
      router.push(link);
    }
    console.log("Card clicked");
  }

  function handleButtonClick(event: any) {
    event.stopPropagation(); // Stop the event from bubbling up to the card
    console.log("Button clicked");
  }

  return (
    <Card
      className={cn(className, "flex flex-col grow")}
      onClick={handleCardClick}
    >
      <CardHeader className="items-center pb-0">
        <div className="flex flex-row justify-between items-center w-full">
          <CardTitle className="text-sm font-semibold text-neutral-600">
            {title}
            {desc && <p className="text-xs font-medium mt-2">{desc}</p>}
          </CardTitle>
          <Button
            className="aspect-square z-10  "
            variant="ghost"
            onClick={handleButtonClick}
          >
            <ExportCurve size="32" color="#0a0a0a" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-0">{renderChart()}</CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        {/* Footer content if needed, or leave empty */}
      </CardFooter>
    </Card>
  );
}
