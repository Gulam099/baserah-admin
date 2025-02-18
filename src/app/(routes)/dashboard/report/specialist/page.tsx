"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UnifiedPagination from "@/features/home/components/UnifiedPagination";
import { Badge } from "@/components/ui/badge";
import { fetchReportSpecialistRecords } from "@/features/report/util/report.util";
import { ReportSpecialistType } from "@/features/report/types/report.type";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  // Read page/pageSize from the URL, or fallback to 1 / 9
  const pageParam = searchParams.page;
  const pageSizeParam = searchParams.pageSize;
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;

  const [specialists, setSpecialists] = useState<ReportSpecialistType[]>([]);
  const [maxSession, setMaxSession] = useState(0);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0); // track total items

  // Whenever page/pageSize changes in the URL, fetch new data
  useEffect(() => {
    setLoading(true);
    fetchReportSpecialistRecords(currentPage, pageSize)
      .then((res) => {
        setSpecialists(res.data.specialists!);
        setMaxSession(res.data.maxSession);
        setTotal(res.page?.total!); // for UnifiedPagination's `total` prop
      })
      .catch((err) => {
        console.error("Failed to fetch questions:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, pageSize]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto ">
      <div className="rounded-md border min-h-[80vh]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profile Image</TableHead>
              <TableHead>Specialist's Name</TableHead>
              <TableHead>Joining</TableHead>
              <TableHead>Sessions</TableHead>
              <TableHead>Percentage out of 100%</TableHead>
              <TableHead>Percentage out of 5%</TableHead>
              <TableHead>Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {specialists.map((s) => {
              let percentOutOf100 = Math.round((s.session / maxSession) * 100);
              let percentOutOf5 = Math.round((percentOutOf100 / 100) * 5);

              let ratingStyle: {
                title: string;
                variant:
                  | "default"
                  | "destructive"
                  | "outline"
                  | "secondary"
                  | "success"
                  | "warning"
                  | "danger";
              } = { title: "Poor", variant: "danger" };
              if (s.rating >= 5)
                ratingStyle = { title: "Excellent", variant: "success" };
              else if (s.rating >= 4)
                ratingStyle = { title: "Medium", variant: "warning" };
              else if (s.rating >= 3)
                ratingStyle = { title: "Fair", variant: "default" };

              return (
                <TableRow key={s.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage
                        src={s.profile_image}
                        alt={s.name + "_avatar"}
                      />
                      <AvatarFallback>{s.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>
                    {format(new Date(s.joining_at), "dd-MM-yyyy")}
                  </TableCell>
                  <TableCell>{s.session}</TableCell>
                  <TableCell>{percentOutOf100}</TableCell>
                  <TableCell>{percentOutOf5}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={ratingStyle.variant}>
                        {ratingStyle.title}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <UnifiedPagination total={total} />
    </div>
  );
}
