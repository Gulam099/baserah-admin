"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ApprovalContentItemType } from "@/features/approval/approval.type";
import { fetchApprovalContent } from "@/features/approval/utils/approval.util";
import { toTitleCase } from "@/features/home/utils/string.utils";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function ApprovalContentPage({
  params,
}: {
  params: { content_type: string; content_id: string };
}) {
  const { content_id } = params;
  const content_type = decodeURIComponent(params.content_type);
  const [content, setContent] = useState<ApprovalContentItemType>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchApprovalContent(content_id)
      .then((res) => {
        setContent(res.data!);
      })
      .catch((err) => {
        console.error("Failed to fetch questions:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [content_id, content_type]);

  if (loading) {
    return <div className="flex flex-row  w-full h-full min-h-[80svh] justify-center items-center"><Loader2 className="animate-spin mx-2" /> Loading...</div>;
  }

  if (!content) {
    return <div>No content found.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">
        {toTitleCase(content.contentType)}
      </h1>
      <div className="w-full h-full border p-10 rounded-2xl flex flex-col gap-2">
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

          <div className="flex flex-row flex-wrap justify-end gap-4 pt-8">
            <Button variant={"secondary"}>Approval Rejection</Button>
            <Button variant={"secondary"}>Alteration Request</Button>
            <Button variant={"default"}>Content Approved</Button>
          </div>
        </div>
      </div>
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
