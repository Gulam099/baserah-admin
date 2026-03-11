"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { ApiBaseUrlLocal } from "../../../../const";

type SupportGroup = {
  _id: string;
  title: string;
  approval_status: boolean;
  doctor: { _id: string; email: string };
  type: string;
  goals: string;
  components: string;
  faq: string;
  cost: number;
  imageUrl: string;
  status: string;
  module: string;
  createdAt: string;
};

export default function EditSupportGroupClient({ id }: { id: string }) {
  const { t } = useTranslation();
  const [group, setGroup] = useState<SupportGroup>();
  const [loading, setLoading] = useState(true);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const router = useRouter();

  const badgeVariant: Record<string, "default" | "success" | "warning" | "danger" | "outline"> = {
    approved: "success",
    pending: "warning",
    cancelled: "danger",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${ApiBaseUrlLocal}/api/support-groups/support-group/${id}`);
        setGroup(res.data.data);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || t("supportGroup.errorMsg"));
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
    else toast.error(t("supportGroup.missingId"));
  }, [id, t]);

  const handleApprovalUpdate = async (status: boolean, alternative: boolean) => {
    if (!group) return;
    setApprovalLoading(true);
    try {
      const res = await axios.put(`${ApiBaseUrlLocal}/api/support-groups/approve/${group._id}`, {
        approvalStatus: status,
        alternative: alternative,
      });
      setGroup(res.data.data);
      toast.success(t("toast.updateSuccess"));
      router.push("/dashboard/approval");
    } catch {
      toast.error(t("supportGroup.errorMsg"));
    } finally {
      setApprovalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-row w-full h-full min-h-[80svh] justify-center items-center">
        <Loader2 className="animate-spin mx-2" /> {t("supportGroup.loading")}
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex justify-center items-center min-h-[60svh]">
        {t("supportGroup.errorTitle")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">{t("supportGroup.detailsTitle")}</h1>
      <p className="text-sm text-muted-foreground">{t("supportGroup.detailsDescription")}</p>

      <div className="w-full border p-10 rounded-2xl flex flex-col gap-4">
        {/* Status */}
        <div className="text-sm">
          {t("supportGroup.status")} :
          <Badge
            variant={badgeVariant[group.approval_status ? "approved" : "pending"]}
            className="capitalize ml-2"
          >
            {group.approval_status
              ? t("supportGroup.approved")
              : t("supportGroup.pendingApproval")}
          </Badge>
        </div>

        {/* Basic Information */}
        <h2 className="text-xl font-semibold">{t("supportGroup.basicInfo")}</h2>
        <Separator />
        <div>
          <p className="text-sm">{t("supportGroup.title")}</p>
          <p className="text-lg font-semibold">{group.title}</p>
        </div>
        <div>
          <p className="text-sm">{t("supportGroup.type")}</p>
          <p className="text-lg font-semibold">{group.type}</p>
        </div>
        <div>
          <p className="text-sm">{t("supportGroup.module")}</p>
          <p className="text-lg font-semibold">{group.module}</p>
        </div>
        <div>
          <p className="text-sm">{t("supportGroup.cost")}</p>
          <p className="text-lg font-semibold">{group.cost} SAR</p>
        </div>
        <div>
          <p className="text-sm">{t("supportGroup.createdAt")}</p>
          <p className="text-lg font-semibold">
            {new Date(group.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Doctor Information */}
        <h2 className="text-xl font-semibold pt-4">{t("supportGroup.doctorInfo")}</h2>
        <Separator />
        <p className="text-sm">{t("supportGroup.email")}</p>
        <p className="text-lg font-semibold">{group.doctor?.email}</p>

        {/* Detailed Information */}
        <h2 className="text-xl font-semibold pt-4">{t("supportGroup.detailedInfo")}</h2>
        <Separator />
        <p className="text-sm">{t("supportGroup.goals")}</p>
        <p className="text-sm">{group.goals}</p>

        <p className="text-sm pt-3">{t("supportGroup.components")}</p>
        <p className="text-sm">{group.components}</p>

        <p className="text-sm pt-3">{t("supportGroup.faq")}</p>
        <div className="text-sm leading-relaxed">
          {group.faq.split("\n").map((item, i) => (
            <div key={i} className="flex items-start mb-2">
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2"></span>
              {item}
            </div>
          ))}
        </div>

        {/* Group Image */}
        {group.imageUrl && (
          <>
            <p className="text-sm pt-3">{t("supportGroup.groupImage")}</p>
            <img
              src={group.imageUrl}
              alt="Support Group"
              className="max-w-md rounded-xl mt-2"
            />
          </>
        )}

        {/* Actions */}
        <div className="flex flex-row flex-wrap justify-end gap-4 pt-4">
          {!group.approval_status && (
            <Button
              variant="default"
              onClick={() => handleApprovalUpdate(true, false)}
              disabled={approvalLoading}
            >
              {approvalLoading
                ? t("supportGroup.updating")
                : t("supportGroup.approveGroup")}
            </Button>
          )}

          <Button variant="secondary" onClick={() => handleApprovalUpdate(false, true)} disabled={loading}>
            Alteration Request
          </Button>

          <Button
            variant="secondary"
            onClick={() => handleApprovalUpdate(false, false)}
            disabled={approvalLoading}
          >
            {t("actions.reject")}
          </Button>

        </div>
      </div>
    </div>
  );
}
