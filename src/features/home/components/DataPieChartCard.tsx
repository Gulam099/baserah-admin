import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
  Label,
  Pie,
  PieChart,
  XAxis,
} from "recharts";
import { ExportCurve } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DataPieChartCard(props: {
  chartType: "pie" | "bar" | "number";
  chartConfig?: ChartConfig;
  chartData?: any[];
  title: string;
  dataTypeTile?: string;
  NumberData?: number;
  className?: string;
}) {
  const {
    chartConfig,
    chartData,
    title,
    dataTypeTile,
    chartType,
    NumberData,
    className,
  } = props;

  const totalVisitors = React.useMemo(() => {
    return chartData?.reduce((acc, curr) => acc + curr.number, 0);
  }, []);
  return (
    <Card className={cn(className, "flex flex-col grow")}>
      <CardHeader className="items-center pb-0">
        <div className="flex flex-row justify-between items-center w-full">
          <CardTitle className="text-sm font-semibold text-neutral-600">
            {title}
          </CardTitle>
          <Button className="aspect-square" variant={"ghost"}>
            <ExportCurve size="32" color="#0a0a0a" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {chartConfig && chartData && (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            {chartType === "pie" ? (
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
            ) : (
              <BarChart accessibilityLayer data={chartData} className="w-full">
                <CartesianGrid vertical={false} className="w-full" />
                <XAxis
                  dataKey="title"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)} className="w-full"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="number" fill="var(--color-number)" radius={8} className="w-full" />
              </BarChart>
            )}
          </ChartContainer>
        )}
        {chartType === "number" && (
          <div className="flex justify-center items-center ">
            <p className="text-center text-2xl font-semibold py-12">
              {NumberData}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm"></CardFooter>
    </Card>
  );
}
