"use client";
import { useRouter, useSearchParams } from "next/navigation";
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
import { useTranslation } from "react-i18next";

export default function ApprovalContentPage({
  params,
}: {
  params: {
    content_type: string;
    content_id: string;
    record_type?: string;
    sub_type?: string;
  };
}) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  const { content_id, content_type, record_type, sub_type } = params;
  const type = searchParams.get("type");
  const { user } = useUser();
  const [content, setContent] = useState<ApprovalContentItemType>();
  const [loading, setLoading] = useState(true);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const router = useRouter();

  const handleApprovalUpdate = async (
    status: "approved" | "pending" | "cancelled"
  ) => {
    setApprovalLoading(true);
    try {
      let url = "";
      let bodyData = {};

      // Determine API endpoint and request body based on content type
      if (record_type === "content" || content_type === "content") {
        url = `${ApiBaseUrlLocal}/api/admin/cultural-content/update-status/${content_id}`;
        bodyData = { status };
      } else if (record_type === "group" || content_type === "group") {
        url = `${ApiBaseUrlLocal}/api/support-groups/update/${content_id}`;
        bodyData = { approval_status: status };
      } else if (record_type === "refund" || content_type === "refund") {
        url = `${ApiBaseUrlLocal}/api/refunds/update/${content_id}`;
        bodyData = { status };
      } 
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || t("error.updateFailed"));

      router.push(`/dashboard/approval`);
      toast.success(t("toast.updateSuccess"));
    } catch (error: any) {
      console.error("Approval update error:", error);
      toast.error(error.message || t("error.updateFailed"));
    } finally {
      setApprovalLoading(false);
    }
  };

  // Fetch data based on content type
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = "";

        // Determine API endpoint based on record type or content type
        if (record_type === "content" || content_type === "content") {
          url = `${ApiBaseUrlLocal}/api/library/getbyid/${content_id}`;
        } else if (record_type === "group" || content_type === "group") {
          url = `${ApiBaseUrlLocal}/api/support-groups/get/${content_id}`;
        } else if (record_type === "refund" || content_type === "refund") {
          url = `${ApiBaseUrlLocal}/api/refunds/get/${content_id}`;
        }
        console.log("Fetching from URL:", url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        console.log("Fetched data:", json);

        // Handle different response structures
        let contentData = json.data || json;

        // Normalize the data structure
        if (record_type === "group" || content_type === "group") {
          contentData = {
            ...contentData,
            status: contentData.approval_status,
            type: contentData.module || content_type,
          };
        } else if (record_type === "content" || content_type === "content") {
          contentData = {
            ...contentData,
            type: contentData.type || sub_type || content_type,
          };
        }

        setContent(contentData);
      } catch (error: any) {
        console.error("Fetch error:", error);
        toast.error(error.message || t("error.fetchContent"));
      } finally {
        setLoading(false);
      }
    };

    if (content_id) {
      fetchData();
    }
  }, [content_id, content_type, record_type, sub_type, t]);

  if (loading) {
    return (
      <div className="flex flex-row w-full h-full min-h-[80svh] justify-center items-center">
        <Loader2 className="animate-spin mx-2" /> {t("loading")}
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="text-lg font-medium">{t("error.noContent")}</div>
        <Button onClick={() => router.back()} variant="outline">
          {t("goBack")}
        </Button>
      </div>
    );
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
    pending: "warning",
    approved: "success",
    rejected: "danger",
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button onClick={() => router.back()} variant="outline" size="sm">
          ← {t("back")}
        </Button>
        <h1 className="text-2xl font-semibold">
          {type ? toTitleCase(type) : t("unknown")} -{t("approval")}
        </h1>
      </div>

      <div className="w-full h-full border p-10 rounded-2xl flex flex-col gap-2">
        <div className="text-sm pb-3">
          {t("status")} :
          <Badge
            variant={badgeVariant[content.status?.toLowerCase()] ?? "outline"}
            className="capitalize ml-2"
          >
            {t(`status.${content.status}`) || content.status || "-"}
          </Badge>
        </div>
        <Separator />

        <div className="flex flex-col gap-4">
          {type && (
            <div>
              <p className="text-sm font-medium">{t("contentType")}</p>
              <p className="text-lg capitalize">{type || t("unknown")}</p>
            </div>
          )}

          <Separator />

          <div id="content" className="w-full py-6">
            <ResourceRenderer
              content={{
                type: content.type,
                resource: content,
                recordType: record_type || content_type,
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row flex-wrap justify-end gap-4 pt-8">
            {!["approved"].includes(content.status?.toLowerCase()) && (
              <Button
                variant="default"
                onClick={() => handleApprovalUpdate("approved")}
                disabled={approvalLoading}
              >
                {approvalLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {t("actions.approve")}
              </Button>
            )}

            <Button
              variant="secondary"
              onClick={() => handleApprovalUpdate("pending")}
              disabled={approvalLoading}
            >
              {approvalLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {t("actions.alterationRequest")}
            </Button>

            {!["cancelled", "rejected"].includes(
              content.status?.toLowerCase()
            ) && (
              <Button
                variant="destructive"
                onClick={() => handleApprovalUpdate("cancelled")}
                disabled={approvalLoading}
              >
                {approvalLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {t("actions.reject")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourceRenderer({ content }: any) {
  const { type, resource, recordType } = content;
  const { t } = useTranslation();

  const typeMap: Record<string, string> = {
    مقال: "article",
    فيديو: "video",
    صوت: "audio",
  };

  const lowerType = typeMap[type] || type?.toLowerCase() || "";

  console.log(
    "ResourceRenderer - type:",
    lowerType,
    "recordType:",
    recordType,
    "resource:",
    resource
  );

  // Handle different record types
  if (recordType === "refund") {
    return (
      <div className="flex flex-col gap-4 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold">{t("refundDetails")}</h3>

        {resource.amount && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">{t("user name")}:</span>
              <span>{resource.patientId.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">{t("doctor name")}:</span>
              <span>{resource.doctorId.full_name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">{t("amount")}:</span>
              <span>{resource.amount} SAR</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">{t("reason")}:</span>
              <span>{resource.bookingId.cancelReason}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">{t("booking time and date")}:</span>
              <span>{resource.bookingId.cancelReason}</span>
            </div>
          </>
        )}
      </div>
    );
  }

  if (recordType === "group") {
    return (
      <div className="flex flex-col gap-4 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold">
          {type === "support" ? t("groupDetails") : t("programDetails")}
        </h3>

        <div>
          <span className="font-medium">{t("Specialist name ")}</span>
          <p className="mt-1 text-gray-600">{resource.doctor.full_name}</p>
        </div>

        <div>
          <span className="font-medium">
            {t(`${type === "support" ? "group" : "program"} price`)}:
          </span>
          <p className="mt-1 text-gray-600">{resource.cost}</p>
        </div>

        <div>
          <span className="font-medium">{t("goals")}:</span>
          <p className="mt-1">{resource.goals}</p>
        </div>

         <div>
          <span className="font-medium">{t("faq")}:</span>
          <p className="mt-1">{resource.faq}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="font-medium">{t("specialist")}:</span>
          <span>
            {resource.specialist?.map((s: any) => s.full_name).join(", ")}{" "}
            {t("participants")}
          </span>
        </div>

       

        {resource.endDate && (
          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium">{t("endDate")}:</span>
            <span>{new Date(resource.endDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    );
  }

  // Handle cultural content (articles, videos, audio)
  switch (lowerType) {
    case "article":
      return (
        <div className="flex flex-col gap-4">
          {resource.thumbnail && (
            <div>
              <h4 className="font-medium mb-2">{t("thumbnail")}</h4>
              <img
                src={resource.thumbnail}
                alt="Article Thumbnail"
                className="w-full max-w-md rounded-xl shadow-md"
              />
            </div>
          )}

          {resource.content && (
            <div>
              <h4 className="font-medium mb-2">{t("content")}</h4>
              <div className="prose max-w-none p-4 border rounded-lg bg-gray-50">
                {resource.content}
              </div>
            </div>
          )}

          {resource.tags && resource.tags.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">{t("tags")}</h4>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
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

      const videoId = resource.videoLink
        ? getYoutubeVideoId(resource.videoLink)
        : null;
      const thumbnail = videoId
        ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        : null;

      return (
        <div className="flex flex-col gap-4">
          {videoId ? (
            <div>
              <h4 className="font-medium mb-2">{t("videoPreview")}</h4>
              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition inline-block"
              >
                <img
                  src={thumbnail ?? undefined}
                  alt="YouTube Video Thumbnail"
                  className="w-full max-w-xl rounded-xl shadow-md"
                />
              </a>
              <p className="text-sm text-muted-foreground mt-2">
                {t("clickToWatch")}
              </p>
            </div>
          ) : resource.videoLink ? (
            <div>
              <h4 className="font-medium mb-2">{t("videoLink")}</h4>
              <a
                href={resource.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline break-all"
              >
                {resource.videoLink}
              </a>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("error.invalidYouTube")}
            </p>
          )}

          {resource.duration && (
            <div>
              <span className="font-medium">{t("duration")}:</span>
              <span className="ml-2">{resource.duration}</span>
            </div>
          )}
        </div>
      );

    case "audio":
      return (
        <div className="flex flex-col gap-4">
          {resource.mediaUrl ? (
            <div>
              <h4 className="font-medium mb-2">{t("audioPlayer")}</h4>
              <audio controls className="w-full">
                <source src={resource.mediaUrl} type="audio/mpeg" />
                {t("audioNotSupported")}
              </audio>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t("noAudio")}</p>
          )}

          {resource.duration && (
            <div>
              <span className="font-medium">{t("duration")}:</span>
              <span className="ml-2">{resource.duration}</span>
            </div>
          )}

          {resource.transcript && (
            <div>
              <h4 className="font-medium mb-2">{t("transcript")}</h4>
              <div className="p-4 border rounded-lg bg-gray-50 max-h-40 overflow-y-auto">
                {resource.transcript}
              </div>
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="p-4 border rounded-lg bg-gray-50">
          <p className="text-sm text-muted-foreground">
            {t("error.unsupportedType", { type: lowerType || "unknown" })}
          </p>

          {/* Display raw data for debugging */}
          {process.env.NODE_ENV === "development" && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium">
                {t("debug.rawData")}
              </summary>
              <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(resource, null, 2)}
              </pre>
            </details>
          )}
        </div>
      );
  }
}
