"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { fetchSpecContentRecords } from "../utils/specialist.util";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toTitleCase } from "@/features/home/utils/string.utils";
import UnifiedPagination from "@/features/home/components/UnifiedPagination";

/**
 * Renders content items for a given specialist
 */
export default function Content(props: { specilaistId: string }) {
  const { specilaistId } = props;

  // 1) Pagination from URL
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const pageSizeParam = searchParams.get("pageSize");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;

  // 2) State for fetched data
  const [contentList, setContentList] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // 3) Fetch data on mount or page/pageSize change
  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    fetchSpecContentRecords(specilaistId, currentPage, pageSize)
      .then((res) => {
        // If component unmounted in the meantime, skip
        if (!isMounted) return;

        // Set the data array & total for pagination
        setContentList(Array.isArray(res.data) ? res.data : []);
        setTotal(res.page?.total || 0);
      })
      .catch((err) => {
        console.error("Failed to fetch specialist content:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [specilaistId, currentPage, pageSize]);

  // 4) Loading/Empty states
  if (loading) {
    return (
      <div className="flex flex-row w-full h-full min-h-[80svh] justify-center items-center">
        <Loader2 className="animate-spin mx-2" />
        <span>Loading...</span>
      </div>
    );
  }

  if (!contentList || contentList.length === 0) {
    return <div className="p-4">No content found.</div>;
  }

  // 5) Render the content
  return (
    <div className="p-6 flex flex-col gap-4">
      {contentList.map((item, index) => {
        // Safely handle missing fields
        const approvalStatus = item?.approval_status ?? "N/A";
        const contentType = item?.type ?? "unknown";
        const contentTitle = item?.title ?? "No title";
        const note = item?.note ?? "";
        const resources = Array.isArray(item?.resources) ? item.resources : [];

        return (
          <div
            className="w-full h-full border p-6 rounded-2xl flex flex-col gap-2"
            key={(contentTitle || "untitled") + index}
          >
            {/* Example: We used "contentType" as "type" in your code. 
                If your server uses "contentType" or "category", adjust accordingly. */}
            <h1 className="text-2xl font-semibold">
              {toTitleCase(contentType)}
            </h1>

            <div className="text-sm pb-3">
              Approval:{" "}
              <Badge className="capitalize">
                {toTitleCase(approvalStatus)}
              </Badge>
            </div>

            <h2 className="text-xl font-semibold">{contentTitle}</h2>
            <Separator />

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Content Type</p>
              <p className="text-lg font-semibold capitalize">{contentType}</p>

              <p className="text-sm font-medium">Preview</p>
              <div id="content" className="w-full py-6">
                <ResourceRenderer
                  content={{
                    type: contentType,
                    resource: resources,
                  }}
                />
              </div>

              {note && (
                <>
                  <p className="text-sm font-medium">Note</p>
                  <p className="text-sm">{note}</p>
                </>
              )}
            </div>
          </div>
        );
      })}

      <UnifiedPagination total={total} />
    </div>
  );
}

/**
 * Renders resource based on type: text, video, audio, etc.
 */
function ResourceRenderer({ content }: any) {
  const lowerType = content.type?.toLowerCase() || "";
  const resourceArr = Array.isArray(content.resource) ? content.resource : [];

  if (resourceArr.length === 0) {
    return <p className="text-sm text-muted-foreground">No resources found.</p>;
  }

  switch (lowerType) {
    case "text":
      return <p>{resourceArr[0]}</p>;

    case "video":
      return (
        <video src={resourceArr[0]} controls className="w-1/2 rounded-xl">
          Your browser does not support the video tag.
        </video>
      );

    case "audio":
      return (
        <audio src={resourceArr[0]} controls className="w-full">
          Your browser does not support the audio element.
        </audio>
      );

    default:
      return (
        <p className="text-sm text-muted-foreground">
          Unsupported content type: {content.type}
        </p>
      );
  }
}
