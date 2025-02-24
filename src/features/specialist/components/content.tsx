"use client";
import { useEffect, useState } from "react";
import { fetchSpecContentRecords } from "../utils/specialist.util";
import { Loader2 } from "lucide-react";
import { ApprovalContentItemType } from "@/features/approval/approval.type";
import { Badge } from "@/components/ui/badge";
import { toTitleCase } from "@/features/home/utils/string.utils";
import { Separator } from "@/components/ui/separator";
import UnifiedPagination from "@/features/home/components/UnifiedPagination";

export default function Content(props: {
  searchParams: { [key: string]: string };
}) {
  const { searchParams } = props;
  // Read page/pageSize from the URL, or fallback to 1 / 9
  const pageParam = searchParams.page;
  const pageSizeParam = searchParams.pageSize;
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;

  const [content, setContent] = useState<ApprovalContentItemType[]>();
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

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
    <div className="p-6 flex flex-col gap-4">
      {content.map((content, index) => (
        <div
          className="w-full h-full border p-10 rounded-2xl flex flex-col gap-2"
          key={content.content.title + index}
        >
          <h1 className="text-2xl font-semibold">
            {toTitleCase(content.contentType)}
          </h1>
          <div className="text-sm pb-3">
            Address :{"  "}
            <Badge className="capitalized">
              {"Approval " + toTitleCase(content.content.status)}
            </Badge>
          </div>
          <h2 className="text-xl font-semibold">{content.content.title}</h2>
          <Separator />
          <div className="flex flex-col gap-2">
            <p className="text-sm">Content Type</p>
            <p className="text-lg font-semibold capitalize">
              {content.content.type}
            </p>
            <p className="text-sm">Content separator</p>
            <div id="content" className="w-full py-6">
              <ResourceRenderer
                content={{
                  type: content.content.type,
                  resource: content.content.resources,
                }}
              />
            </div>
            {content.content.note && (
              <>
                <p className="text-sm">Note : </p>
                <p className="text-sm">{content.content.note}</p>
              </>
            )}
          </div>
        </div>
      ))}

      <UnifiedPagination total={total} />
    </div>
  );
}

function ResourceRenderer({ content }: any) {
  const { type, resource } = content;
  const lowerType = type?.toLowerCase() || "";

  switch (lowerType) {
    case "article":
      return <p>{resource[0]}</p>;

    case "video":
      return (
        <video src={resource[0]} controls className="w-1/2 rounded-xl">
          Your browser does not support the video tag.
        </video>
      );

    case "audio":
      return (
        <audio src={resource[0]} controls className="w-full">
          Your browser does not support the audio element.
        </audio>
      );

    default:
      return (
        <p className="text-sm text-muted-foreground">
          Unsupported content type: {type}
        </p>
      );
  }
}
