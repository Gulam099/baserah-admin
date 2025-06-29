"use client";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ApprovalContentItemType } from "@/features/approval/approval.type";
import { toTitleCase } from "@/features/home/utils/string.utils";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ApiBaseUrlLocal } from "../../../../../../../const";


export default function ApprovalContentPage({
  params,
}: {
  params: { content_type: string; content_id: string };
}) {
  const { content_id } = params;
  const { user } = useUser();
  const content_type = decodeURIComponent(params.content_type);
  const [content, setContent] = useState<ApprovalContentItemType>();
  const [loading, setLoading] = useState(true);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const router = useRouter();

  const handleApprovalUpdate = async (
    status: "approved" | "pending" | "cancelled"
  ) => {
    setApprovalLoading(true);
    try {
      const response = await fetch(
        `${ApiBaseUrlLocal}/api/admin/cultural-content/update-status/${content_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Update failed");
      }
      // Redirect after success
      router.push(`/dashboard/approval`);
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.message || "Failed to update approval status.");
    } finally {
      setApprovalLoading(false);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${ApiBaseUrlLocal}/api/library/getbyid/${content_id}`
        );
        const json = await response.json();
        setContent(json.data); // <<== important
      } catch (error) {
        toast.error("Failed to fetch content.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [content_id]);

  console.log("content?", content);


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

  const badgeVariant: {
    [key in string]:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "secondary"
    | "destructive"
    | "outline";
  } = {
    upcoming: "default",
    completed: "success",
    ongoing: "warning",
    cancelled: "danger",
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">
        {content.type ? toTitleCase(content.type) : "Unknown"}
      </h1>
      <div className="w-full h-full border p-10 rounded-2xl flex flex-col gap-2">
        <div className="text-sm pb-3">
          Address :{"  "}
          <Badge
            variant={
              content.status
                ? badgeVariant[content.status]
                : "outline"
            }
            className={"capitalize"}
          >
            {content?.status ?? "Unknown"}
          </Badge>
        </div>
        <h2 className="text-xl font-semibold">{content.title}</h2>
        <Separator />
        <div className="flex flex-col gap-2">
          <p className="text-sm">Content Type</p>
          <p className="text-lg font-semibold capitalize">{content.type}</p>
          <p className="text-sm">Content separator</p>
          <div id="content" className="w-full py-6">
            <ResourceRenderer
              content={{
                type: content.type,
                resource: content,
              }}
            />
          </div>
          {content.note && (
            <>
              <p className="text-sm">Note : </p>
              <p className="text-sm">{content.note}</p>
            </>
          )}


          <div className="flex flex-row flex-wrap justify-end gap-4 pt-8">
            {!["approved"].includes(content.status) && (
              <Button
                variant="default"
                onClick={() => handleApprovalUpdate("approved")}
                disabled={approvalLoading}
              >
                Content Approved
              </Button>
            )}
            {!["cancelled"].includes(content.status) && (
              <Button
                variant="secondary"
                onClick={() => handleApprovalUpdate("cancelled")}
                disabled={approvalLoading}
              >
                Approval Rejection
              </Button>
            )}
            {/* <Button variant="secondary" onClick={() => handleApprovalUpdate("pending")} disabled={loading}>
        Alteration Request
      </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourceRenderer({ content }: any) {
  const { type, resource } = content;

  const typeMap: Record<string, string> = {
    "مقال": "article",
    "فيديو": "video",
    "صوت": "audio",
  };

  const lowerType = typeMap[type] || type?.toLowerCase() || "";

  console.log("resource", resource);

  switch (lowerType) {
    case "article":
      return (
        <div className="flex flex-col gap-4">
          {resource.thumbnail && (
            <img
              src={resource.thumbnail}
              alt="Article Thumbnail"
              className="w-1/2 rounded-xl"
            />
          )}
        </div>
      );

    case "video":
      const getYoutubeVideoId = (url: string): string | null => {
        try {
          const ytRegex =
            /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
          const match = url.match(ytRegex);
          return match && match[1] ? match[1] : null;
        } catch {
          return null;
        }
      };

      const videoId = getYoutubeVideoId(resource.videoLink);
      const thumbnail = videoId
        ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        : null;

      return videoId ? (
        <div className="flex flex-col gap-2">
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition"
          >
            <img
              src={thumbnail}
              alt="YouTube Video Thumbnail"
              className="w-full max-w-xl rounded-xl"
            />
          </a>
          <p className="text-sm text-muted-foreground">
            Click the image to watch the video on YouTube.
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Invalid YouTube link.</p>
      );

    case "audio":
      return resource.mediaUrl ? (
        <div className="w-full">
          <audio controls className="w-full">
            <source src={resource.mediaUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No audio available.</p>
      );

    default:
      return (
        <p className="text-sm text-muted-foreground">
          Unsupported content type: {type}
        </p>
      );
  }
}


