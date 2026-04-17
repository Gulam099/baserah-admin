"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChartConfig } from "@/components/ui/chart";
import DataPieChartCard from "@/features/home/components/DataPieChartCard";
import MapComp from "@/features/report/components/MapComp";
import { SliderPerson } from "@/features/report/components/SliderPerson";
import { fetchPatientReturnStats } from "@/features/report/util/report.util";
import { ApiBaseUrl } from "../../../../../const";
import { useTranslation } from "react-i18next";
import ExportButton from "@/features/home/components/ExportButton";
import PageLoading from "@/components/page-loading";


const colorMap = {
  Completed: "#32CD32",
  Cancelled: "#9B59B6",
  Ongoing: "#F4A460",
  Pending: "#1E3A8A",
};

export default function page() {
  const [appointmentStats, setAppointmentStats] = useState<
    { title: string; number: number }[]
  >([]);
  const [appointmentChartData, setAppointmentChartData] = useState<
    { title: string; number: number; fill: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();


  const [userChartData, setUserChartData] = useState();
  type DoctorSession = {
    doctor: any;
    doctorId: string;
    total: number;
    // add other properties if needed
  };

  const [doctorSessionData, setDoctorSessionData] = useState<DoctorSession[]>([]);


  const [appointmentTypeData, setAppointmentTypeData] = useState<
    { title: string; number: number; fill: string }[]
  >([]);
  const [userTypeData, setUserTypeData] = useState<
    { title: string; number: number; fill: string }[]
  >([]);
  const contentRef = useRef(null);


  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        await Promise.all([
          loadAppointmentType(),
          loadStats(),
          loadCustomerReturnData(),
          loadDoctorSessions(),
          loadUserTypeData(),
        ]);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    }

    async function loadAppointmentType() {
      const res = await fetch(`${ApiBaseUrl}/api/doctor/appointments-type`);
      const data = await res.json();
      if (data.data) {
        const mappedData = data.data.map((item: any) => ({
          title: item.title,
          number: item.value,
          fill: item.fill,
        }));
        setAppointmentTypeData(mappedData);
      }
    }

    async function loadStats() {
      const res = await fetch(`${ApiBaseUrl}/api/doctor/appointments/stats`);
      const data = await res.json();
      if (data.appointment) {
        setAppointmentStats(data.appointment);
        const chartData = data.appointment.map((item: { title: keyof typeof colorMap; number: number }) => ({
          title: item.title,
          number: item.number,
          fill: colorMap[item.title.trim() as keyof typeof colorMap] || "#8884d8",
        }));
        setAppointmentChartData(chartData);
      }
    }

    async function loadCustomerReturnData() {
      try {
        const res = await fetch(`${ApiBaseUrl}/api/users/user-return`);
        const data = await res.json();
        if (data?.data) {
          const mapped = data.data.map((item: any) => ({
            title: item.title,
            number: item.number,
            fill: item.fill,
          }));
          setUserChartData(mapped as any);
        }
      } catch (error) {
        console.error("Error fetching user return data:", error);
      }
    }

    async function loadDoctorSessions() {
      const res = await fetch(`${ApiBaseUrl}/api/doctors/getdoctorsession`);
      const data = await res.json();
      setDoctorSessionData(data.data);
    }

    async function loadUserTypeData() {
      try {
        const res = await fetch(`${ApiBaseUrl}/api/doctor/user-type`);
        const data = await res.json();
        if (data.length) {
          const flattened: any[] = [];
          const colorPalette = [
            "#FF6B6B", "#6BCB77", "#4D96FF", "#FFC75F", "#845EC2",
            "#008F7A", "#FF9671", "#2C73D2", "#D65DB1", "#FF6F91",
          ];
          let colorIndex = 0;
          data.forEach((item: any) => {
            item.specializations.forEach((spec: any) => {
              flattened.push({
                title: spec,
                number: item.number[spec],
                fill: colorPalette[colorIndex % colorPalette.length],
              });
              colorIndex++;
            });
          });
          setUserTypeData(flattened);
        }
      } catch (error) {
        console.error("Error fetching user type data:", error);
      }
    }

    fetchData();
  }, []);


  const appointmentChartConfig = {
    number: {
      label: t("report.number"),
    },
    Completed: {
      label: t("report.completed"),
      color: colorMap["Completed"],
    },
    Cancelled: {
      label: t("report.cancelled"),
      color: colorMap["Cancelled"],
    },
    Ongoing: {
      label: t("report.ongoing"),
      color: colorMap["Ongoing"],
    },
    Pending: {
      label: t("report.pending"),
      color: colorMap["Pending"],
    },
  } satisfies ChartConfig;


  const excelData = {
    appointmentStats,
    appointmentTypeData,
    appointmentChartData,
    userChartData,
    doctorSessionData,
    userTypeData,
  };

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="flex flex-col gap-4" ref={contentRef}>
      <div className="flex justify-end">
        <ExportButton contentRef={contentRef} label={t("export")} excelData={excelData as any} />
      </div>
      <h2 className="text-lg font-semibold text-neutral-800">	{t("report.appointmentsTitle")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {appointmentStats.map((item, index) => (
          <DataPieChartCard
            key={index}
            chartType="number"
            NumberData={item.number}
            title={t(item.title.replace(' ', ''))}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-4 justify-between">
        {/* user return  */}
        <DataPieChartCard
          chartType="pie"
          chartConfig={{
            number: {
              label: "number",
            },
            CustomerReturn: {
              label: t("report.CustomerReturn"),
              color: "#000A80",
            },
            OneTime: {
              label: t("report.OneTime"),
              color: "#D2A8FF",
            },

          }}
          chartData={userChartData}
          title={t("report.customerReturnRate")}
          dataTypeTile="Total"
          className="basis-1/5"
        />

        {/* appointment typee */}
        <DataPieChartCard
          chartType="pie"
          chartConfig={{
            number: {
              label: "number",
            },
            Scheduled: {
              label: t("report.Scheduled"),
              color: "#D2A8FF",
            },
            Immediate: {
              label: t("report.Immediate"),
              color: "#000A80",
            },
          }}
          chartData={appointmentTypeData}
          title={t("report.appointmentType")}
          dataTypeTile="Total"
          className="basis-1/5"
        />

        <DataPieChartCard
          chartType="bar"
          chartConfig={appointmentChartConfig}
          chartData={appointmentChartData}
          title={t("report.appointmentStatus")}
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
      <div>
        <SliderPerson
          title={t("report.doctorSessions")}
          desc={t("report.doctorSessionsDesc")}
          data={(doctorSessionData ?? []).map(doc => ({
            name: doc.doctor?.full_name || "Unknown",
            session: doc.total,
            performance: (doc.total / 100) * 100, // adjust if needed
            image: doc.doctor?.profile_picture || "https://via.placeholder.com/80",
          }))}
        // viewMoreLink={`/dashboard/report/doctor`}
        />
      </div>


      {/* <h2 className="text-lg font-semibold text-neutral-800">
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
      </div> */}
      {/* <div className="flex flex-wrap gap-4 justify-between">
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
      </div> */}
      <div>
        {/* <DataPieChartCard
          chartType="line"
          chartConfig={{
            number: {
              label: "number",
            },
            New: {
              label: "New",
              color: "#FF6B6B",
            },
            Returning: {
              label: "Returning",
              color: "#4ECDC4",
            },
          }}
          chartData={userTypeData}
          title={"User Type"}
        /> */}

      </div>
      {/* <div className="flex flex-wrap gap-4 justify-between">
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
      </div> */}
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
