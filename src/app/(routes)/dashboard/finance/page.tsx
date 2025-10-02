"use client";
import React, { useEffect, useState } from "react";
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
import { ArrowLeft, ArrowUpDown, ChevronDown, Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ApiBaseUrl } from "../../../../../const";
import PageLoading from "@/components/page-loading";

interface Doctor {
  _id: string;
  full_name: string;
  profile_picture?: string;
  specialization: string;
}

interface Specialist {
  _id: Doctor;
  grossIncome: number;
  sessions: number;
  place: number;
}

export default function page() {
  const router = useRouter();
  const { t } = useTranslation();

  const [creditAmount, setCreditAmount] = useState(0);
  const [refundAmount, setRefundAmount] = useState(0);
  const [totalincome, setTotalincome] = useState(0);
  const [groupincome, setGroupincome] = useState(0);
  const [programincome, setProgramincome] = useState(0);
  const [scheduleincome, setScheduleincome] = useState(0);
  const [instantincome, setInstantincome] = useState(0);
  const [appointmentincome, setAppointmentincome] = useState(0);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);

  const chartData = [
    {
      title: t("fromWallet"),
      number: creditAmount,
      fill: "hsl(var(--chart-1))",
    },
    {
      title: t("toWallet"),
      number: refundAmount,
      fill: "hsl(var(--chart-2))",
    },
  ];

  const chartConfig = {
    number: {
      label: "number",
    },
    "from wallet": {
      label: "from wallet",
      color: "hsl(var(--chart-1))",
    },
    "to wallet": {
      label: "to wallet",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const data = [
    { title: "Marketing", number: 2039 },
    { title: "Operation", number: 2049 },
    { title: "Technical", number: 5465 },
    { title: "Technical", number: 2039 },
  ];

  const chartData2 = [
    { title: "January", number: 186, fill: "#C084FC" },
    { title: "February", number: 305, fill: "#4ADE80" },
    { title: "March", number: 237, fill: "#F87171" },
    { title: "April", number: 73, fill: "#3B82F6" },
    { title: "May", number: 209, fill: "#06B6D4" },
    { title: "June", number: 214, fill: "#A855F7" },
    { title: "July", number: 214, fill: "#22C55E" },
    { title: "August", number: 186, fill: "#EF4444" },
    { title: "Setember", number: 305, fill: "#10B981" },
    { title: "October", number: 237, fill: "#1D4ED8" },
    { title: "Noverber", number: 73, fill: "#D8B4FE" },
    { title: "December", number: 209, fill: "#0EA5E9" },
  ];
  const chartConfig2 = {
    number: {
      label: "number",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const GeneralStat = [
    {
      title: t("netProfit"),
      icon: WalletAdd,
      number: "1500000",
    },
    {
      title: t("costs"),
      icon: ReceiptText,
      number: "500000",
    },
    {
      title: t("totalIncome"),
      icon: ChartSquare,
      number: totalincome,
    },
  ];

  const Financial_Distribution = [
    {
      title: t("supportGroups"),
      icon: WalletAdd,
      number: groupincome,
    },
    {
      title: t("programs"),
      icon: ReceiptText,
      number: programincome,
    },
    {
      title: t("appointments"),
      icon: ChartSquare,
      number: appointmentincome,
    },
  ];

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const res = await fetch(`${ApiBaseUrl}/api/payments/top-specialists`);
        const data = await res.json();
        if (data.success) {
          // Add place numbers (1,2,3)
          const withPlace = data.data.map((item: any, idx: number) => ({
            ...item,
            place: idx + 1,
          }));
          setSpecialists(withPlace);
        }
      } catch (error) {
        console.error("Error fetching top specialists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialists();
  }, []);

  useEffect(() => {
    const fetchAmounts = async () => {
      try {
        // Fetch total credit amount
        const creditRes = await fetch(
          `${ApiBaseUrl}/api/walletTransaction/wallet-total-amount`
        );
        const creditData = await creditRes.json();
        setCreditAmount(creditData.totalCreditAmount || 0);

        // Fetch total refund amount
        const refundRes = await fetch(
          `${ApiBaseUrl}/api/refunds/refunds-total-amount`
        );
        const refundData = await refundRes.json();
        setRefundAmount(refundData.totalRefundAmount || 0);

        const totalRes = await fetch(
          `${ApiBaseUrl}/api/payments/payments-total-amount`
        );
        const totalincome = await totalRes.json();
        setTotalincome(totalincome.totalCreditAmount || 0);
      } catch (error) {
        console.error("Error fetching amounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAmounts();
  }, []);

  useEffect(() => {
    const fetchTotalAmount = async () => {
      try {
        const groupres = await fetch(
          `${ApiBaseUrl}/api/groups-booking/groups-total-amount`
        );
        const groupsincome = await groupres.json();
        setGroupincome(groupsincome.totalAmount || 0);

        const programres = await fetch(
          `${ApiBaseUrl}/api/programs-booking/programs-total-amount`
        );
        const programsincome = await programres.json();
        setProgramincome(programsincome.totalAmount || 0);

        const scheduleres = await fetch(
          `${ApiBaseUrl}/api/bookings/bookings-total-amount`
        );
        const scheduledincome = await scheduleres.json();
        setScheduleincome(scheduledincome.totalAmount || 0);

        const instantres = await fetch(
          `${ApiBaseUrl}/api/instantbookings/instants-total-amount`
        );
        const instantsincome = await instantres.json();
        setInstantincome(instantsincome.totalAmount || 0);
        setAppointmentincome(scheduleincome + instantincome);
      } catch (error) {
        console.error("Error fetching paid total amount:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalAmount();
  }, []);

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

  if (loading) {
    return <PageLoading />;
  }
  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-wrap gap-4 justify-between ">
        <DataPieChartCard
          chartType="pie"
          chartConfig={chartConfig}
          chartData={chartData}
          title={t("wallet")}
          className="flex-1"
          link="/dashboard/finance/transaction"
        />

        <Card
          className={"flex flex-1 flex-col grow"}
          // onClick={() => handleCardClick("/dashboard/finance/detail")}
        >
          <CardHeader className="items-center pb-0">
            <div className="flex flex-row justify-between items-center w-full">
              <CardTitle className="text-sm font-semibold text-neutral-600">
                {t("generalStatistics")}
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

      {/* Financial Distribution for Reservations */}
      <div className="flex flex-wrap gap-4 justify-between ">
        <Card
          className={"flex flex-1 flex-col grow"}
          onClick={() => handleCardClick("/dashboard/finance/detail")}
        >
          <CardHeader className="items-center pb-0">
            <div className="flex flex-row justify-between items-center w-full">
              <CardTitle className="text-sm font-semibold text-neutral-600">
                {t("financialDistributionReservations")}
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
            {Financial_Distribution.map((item, index) => {
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

          <CardFooter className="flex-col gap-2 text-sm"></CardFooter>
        </Card>
        {/* For Cost distribution */}
        <DataPieChartCard
          chartType="barV"
          chartConfig={chartConfig2}
          chartData={data}
          title={"Cost distribution"}
          className="flex-1"
          // link="/dashboard/finance/detail"
        />
      </div>

      {/* For reservation value */}
      <div>
        <DataPieChartCard
          chartType="bar"
          chartConfig={chartConfig2}
          chartData={chartData2}
          title={"Reservation value"}
          // link="/dashboard/finance/detail"
        />
      </div>
      {/*topEarningsSpecialists */}
      <div>
        <Card
          className={cn("flex flex-1 flex-col grow")}
          onClick={() => handleCardClick("/dashboard/finance/specialist")}
        >
          {/* Header */}
          <CardHeader className="items-center pb-0">
            <div className="flex flex-row justify-between items-center w-full">
              <CardTitle className="text-sm font-semibold text-neutral-600">
                {t("topEarningsSpecialists")}
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
            {specialists.map((item, index) => {
              // Convert numeric place to text
              let placeLabel = "";
              switch (item.place) {
                case 1:
                  placeLabel = t("firstPlace");
                  break;
                case 2:
                  placeLabel = t("secondPlace");
                  break;
                case 3:
                  placeLabel = t("thirdPlace");
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
                        src={item._id.profile_picture}
                        alt={item._id.full_name + "_avatar"}
                      />
                      <AvatarFallback>
                        {item._id.full_name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1">
                      <p className="text-sm font-semibold truncate">
                        {item._id.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item._id?._id}
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
                      { title: t("grossIncome"), number: item.grossIncome },
                      { title: t("numberOfSessions"), number: item.sessions },
                      // { title: t("dues"), number: item.dues },
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
              {t("dataDetails")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
