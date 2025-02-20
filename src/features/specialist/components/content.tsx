"use client";
import { useEffect, useState } from "react";
import { fetchSpecContentRecords } from "../utils/specialist.util";
import { Loader2 } from "lucide-react";

export default function Content(props: {
  searchParams: { [key: string]: string };
}) {
  const { searchParams } = props;
  // Read page/pageSize from the URL, or fallback to 1 / 9
  const pageParam = searchParams.page;
  const pageSizeParam = searchParams.pageSize;
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;

  const [content, setContent] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchSpecContentRecords(currentPage, pageSize)
      .then((res) => {
        setContent(res.data!);
      })
      .catch((err) => {
        console.error("Failed to fetch questions:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, pageSize]);

  if (loading) {
    return (
      <div className="flex flex-row  w-full h-full min-h-[80svh] justify-center items-center">
        <Loader2 className="animate-spin mx-2" /> Loading...
      </div>
    );
  }

  if (!content) {
    return <div>No content found.</div>;
  }
  return (
    <div className="p-6">
      <div className="text-muted-foreground">
        Cultural content will be displayed here
      </div>
    </div>
  );
}
