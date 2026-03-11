"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { fetchSpecContentRecords } from "../utils/specialist.util";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toTitleCase } from "@/features/home/utils/string.utils";
import { useTranslation } from "react-i18next";
import UnifiedPagination from "@/features/home/components/UnifiedPagination";

/**
 * Renders content items for a given specialist
 */
export default function Content(props: { doctorId: string }) {
  const { doctorId } = props;
  const { t } = useTranslation();

  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const pageSizeParam = searchParams.get("pageSize");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;

  const [contentList, setContentList] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    fetchSpecContentRecords(doctorId, currentPage, pageSize)
      .then((res) => {
        if (!isMounted) return;
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
  }, [doctorId, currentPage, pageSize]);

  if (loading) {
    return (
      <div className="flex flex-row w-full h-full min-h-[80svh] justify-center items-center">
        <Loader2 className="animate-spin mx-2" />
        <span>{t("content.loading")}</span>
      </div>
    );
  }

  if (!contentList || contentList.length === 0) {
    return <div className="p-4">{t("content.noContent")}</div>;
  }

  return (
    <div className="p-6 flex flex-col gap-4">
      {contentList.map((item, index) => {
        const approvalStatus = item?.status ?? "N/A";
        const contentType = item?.type ?? "unknown";
        const contentTitle = item?.title ?? t("content.noTitle");
        const note = item?.note ?? "";
        const resources = Array.isArray(item?.file) ? item.file : [];

        return (
          <div
            className="w-full h-full border p-6 rounded-2xl flex flex-col gap-2"
            key={(contentTitle || "untitled") + index}
          >
            <h1 className="text-2xl font-semibold">
              {toTitleCase(contentType)}
            </h1>

            <div className="text-sm pb-3">
              {t("content.approval")}{" "}
              <Badge className="capitalize">
                {toTitleCase(approvalStatus)}
              </Badge>
            </div>

            <h2 className="text-xl font-semibold">{contentTitle}</h2>
            <Separator />

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">{t("content.contentType")}</p>
              <p className="text-lg font-semibold capitalize">{contentType}</p>

              <p className="text-sm font-medium">{t("content.preview")}</p>
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
                  <p className="text-sm font-medium">{t("content.note")}</p>
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

function ResourceRenderer({ content }: any) {
  const { t } = useTranslation();
  const lowerType = content.type?.toLowerCase() || "";
  const resourceArr = Array.isArray(content.resource) ? content.resource : [];

  if (resourceArr.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("content.noResources")}</p>;
  }

  switch (lowerType) {
    case "text":
    case "article":
      return (
        <div className="flex flex-col gap-4">
          {resourceArr.map((url: string, idx: number) => {
            if (url.match(/\.(jpeg|jpg|png|gif)$/i)) {
              return (
                <img
                  key={idx}
                  src={url}
                  alt={t("content.imageAlt", { number: idx + 1 })}
                  className="w-full max-w-md rounded-xl"
                />
              );
            } else if (url.match(/\.(pdf|docx)$/i)) {
              return (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {t("content.viewDocument", { number: idx + 1 })}
                </a>
              );
            } else {
              return <p key={idx}>{url}</p>;
            }
          })}
        </div>
      );

    case "video":
      return (
        <video src={resourceArr[0]} controls className="w-1/2 rounded-xl">
          {t("content.noVideoSupport")}
        </video>
      );

    case "audio":
      return (
        <audio src={resourceArr[0]} controls className="w-full">
          {t("content.noAudioSupport")}
        </audio>
      );

    default:
      return (
        <p className="text-sm text-muted-foreground">
          {t("content.unsupportedType", { type: content.type })}
        </p>
      );
  }
}
