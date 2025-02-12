"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import DataPieChartCard from "@/features/home/components/DataPieChartCard";
import colors from "@/features/home/utils/colors";
import { currencyFormatter } from "@/features/home/utils/currencyFormatter.utils";
import { cn } from "@/lib/utils";
import {
  ChartSquare,
  ExportCurve,
  MedalStar,
  ReceiptText,
  WalletAdd,
} from "iconsax-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function page() {
  const router = useRouter();

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

  const GeneralStat = [
    {
      title: "Net Profit",
      icon: WalletAdd,
      number: "1500000",
    },
    {
      title: "Costs",
      icon: ReceiptText,
      number: "500000",
    },
    {
      title: "Total Income",
      icon: ChartSquare,
      number: "2000000",
    },
  ];

  // topSpecialistData.ts (example file)

  const topSpecialist = [
    {
      name: "Dr. Fahd Al-Qahtani",
      id: "1048593859",
      place: 1,
      grossIncome: 1267,
      sessions: 14000,
      dues: 500,
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Dr. Fahd Al-Qahtani",
      id: "1048593859",
      place: 2,
      grossIncome: 1267,
      sessions: 14000,
      dues: 500,
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Dr. Fahd Al-Qahtani",
      id: "1048593859",
      place: 3,
      grossIncome: 1267,
      sessions: 14000,
      dues: 500,
      image: "https://via.placeholder.com/80",
    },
  ];

  function handleCardClick(link: string) {
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
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-wrap gap-4 justify-between ">
        <DataPieChartCard
          chartType="pie"
          chartConfig={chartConfig}
          chartData={chartData}
          title={"Wallet"}
          className="flex-1"
          link="/dashboard/finance/transaction"
        />

        <Card
          className={"flex flex-1 flex-col grow"}
          onClick={() => handleCardClick("/dashboard/finance/detail")}
        >
          <CardHeader className="items-center pb-0">
            <div className="flex flex-row justify-between items-center w-full">
              <CardTitle className="text-sm font-semibold text-neutral-600">
                General Statistics
              </CardTitle>
              <Button
                className="aspect-square"
                variant="ghost"
                onClick={handleButtonClick}
              >
                <ExportCurve size="32" color="#0a0a0a" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 pb-0 flex flex-row justify-between">
            {GeneralStat.map((item, index) => {
              return (
                <div
                  className=" grow flex flex-col justify-center items-center gap-4"
                  key={index}
                >
                  <div className="p-3 rounded-full bg-primary-700">
                    <item.icon size="24" color="#fff" />
                  </div>
                  <p className=" text-neutral-700">{item.title}</p>
                  <p className="font-semibold">
                    {currencyFormatter(item.number)}
                  </p>
                </div>
              );
            })}
          </CardContent>

          <CardFooter className="flex-col gap-2 text-sm">
            {/* Footer content if needed, or leave empty */}
          </CardFooter>
        </Card>
      </div>
      <div className="flex flex-wrap gap-4 justify-between ">
        <Card
          className={"flex flex-1 flex-col grow"}
          onClick={() => handleCardClick("/dashboard/finance/detail")}
        >
          <CardHeader className="items-center pb-0">
            <div className="flex flex-row justify-between items-center w-full">
              <CardTitle className="text-sm font-semibold text-neutral-600">
                Financial Distribution for Reservations
              </CardTitle>
              <Button
                className="aspect-square"
                variant="ghost"
                onClick={handleButtonClick}
              >
                <ExportCurve size="32" color="#0a0a0a" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 pb-0 flex flex-row justify-between">
            {GeneralStat.map((item, index) => {
              return (
                <div
                  className=" grow flex flex-col justify-center items-center gap-4"
                  key={index}
                >
                  <div className="p-3 rounded-full bg-primary-700">
                    <item.icon size="24" color="#fff" />
                  </div>
                  <p className=" text-neutral-700">{item.title}</p>
                  <p className="font-semibold">
                    {currencyFormatter(item.number)}
                  </p>
                </div>
              );
            })}
          </CardContent>

          <CardFooter className="flex-col gap-2 text-sm">
            {/* Footer content if needed, or leave empty */}
          </CardFooter>
        </Card>

        <DataPieChartCard
          chartType="barV"
          chartConfig={chartConfig2}
          chartData={chartData2}
          title={"Cost distribution"}
          className="flex-1"
          link="/dashboard/finance/detail"
        />
      </div>

      <div>
        <DataPieChartCard
          chartType="bar"
          chartConfig={chartConfig2}
          chartData={chartData2}
          title={"Ticket Type"}
          link="/dashboard/finance/detail"
        />
      </div>

      <div>
        <Card
          className={cn("flex flex-1 flex-col grow")}
          onClick={() => handleCardClick("/dashboard/finance/specialist")}
        >
          {/* Header */}
          <CardHeader className="items-center pb-0">
            <div className="flex flex-row justify-between items-center w-full">
              <CardTitle className="text-sm font-semibold text-neutral-600">
                Top Earnings for Specialists
              </CardTitle>
              <Button
                className="aspect-square"
                variant="ghost"
                onClick={handleButtonClick}
              >
                <ExportCurve size="32" color="#0a0a0a" />
              </Button>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="flex-1 p-6 flex flex-row justify-center items-center gap-6 overflow-x-auto ">
            {topSpecialist.map((item, index) => {
              // Convert numeric place to text
              let placeLabel = "";
              switch (item.place) {
                case 1:
                  placeLabel = "First place";
                  break;
                case 2:
                  placeLabel = "Second place";
                  break;
                case 3:
                  placeLabel = "Third place";
                  break;
                default:
                  placeLabel = `${item.place}th place`;
              }

              return (
                <div
                  key={index}
                  className="grow h-full bg-neutral-200 rounded-md shadow-sm  p-4 flex flex-col items-start gap-2 aspect-video"
                >
                  {/* Top row: Image + name + place */}
                  <div className="flex items-start gap-4 w-full">
                    <Avatar>
                      <AvatarImage
                        src={item.image}
                        alt={item.name + "_avatar"}
                      />
                      <AvatarFallback>{item.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1">
                      <p className="text-sm font-semibold truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.id}
                      </p>
                    </div>
                    <div className="text-primary-400 text-xs font-semibold flex flex-col gap-2 rounded-sm p-1 whitespace-nowrap justify-center items-center">
                      <MedalStar size="24" color={colors.primary[400]} />
                      {placeLabel}
                    </div>
                  </div>

                  {/* Middle row: Stats */}
                  <div className="flex flex-row justify-between w-full h-full items-center">
                    {[
                      { title: "Gross income", number: item.grossIncome },
                      { title: "Number of sessions", number: item.sessions },
                      { title: "Dues", number: item.dues },
                    ].map((ele, j) => (
                      <div
                        className="flex flex-col items-center justify-center w-1/3 gap-2"
                        key={j}
                      >
                        <p className="text-base font-semibold">{ele.number}</p>
                        <p className="text-xs text-muted-foreground text-center">
                          {ele.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>

          <CardFooter className="flex justify-end px-6 py-4">
            <Button variant="default" className="text-sm font-medium">
              Data Details
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
