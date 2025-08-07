"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ApiBaseUrlLocal } from "../../../../const";
import { useTranslation } from "react-i18next";

type SupportGroup = {
  _id: string;
  title: string;
  approval_status: boolean;
  doctor: {
    _id: string;
    email: string;
  };
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
  const [group, setGroup] = useState<SupportGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError(t("supportGroup.missingId"));
      setLoading(false);
      return;
    }

    axios
      .get(`${ApiBaseUrlLocal}/api/support-groups/support-group/${id}`)
      .then((res) => {
        setGroup(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching support group", err);
        setError(
          err?.response?.data?.message || t("supportGroup.errorMsg")
        );
      })
      .finally(() => setLoading(false));
  }, [id, t]);

  const toggleApproval = () => {
    if (!group) return;

    setUpdating(true);
    axios
      .put(`${ApiBaseUrlLocal}/api/support-groups/approve/${group._id}`, {
        approvalStatus: !group.approval_status,
      })
      .then((res) => {
        setGroup(res.data.data);
      })
      .catch(() => {
        alert(t("supportGroup.errorMsg"));
      })
      .finally(() => setUpdating(false));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">{t("supportGroup.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("supportGroup.errorTitle")}</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!group) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t("supportGroup.detailsTitle")}</h1>
              <p className="text-gray-600 mt-1">{t("supportGroup.detailsDescription")}</p>
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${group.approval_status
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
              }`}>
              {group.approval_status ? (
                <>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t("supportGroup.approved")}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {t("supportGroup.pendingApproval")}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("supportGroup.basicInfo")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("supportGroup.title")}</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{group.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("supportGroup.type")}</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{group.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("supportGroup.status")}</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{group.status}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("supportGroup.module")}</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{group.module}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("supportGroup.cost")}</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md font-semibold">{group.cost}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("supportGroup.createdAt")}</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{new Date(group.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Doctor Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("supportGroup.doctorInfo")}</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("supportGroup.email")}</label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{group.doctor.email}</p>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("supportGroup.detailedInfo")}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("supportGroup.goals")}</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-md">
                    <p className="text-gray-900 whitespace-pre-wrap">{group.goals}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("supportGroup.components")}</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-md">
                    <p className="text-gray-900 whitespace-pre-wrap">{group.components}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("supportGroup.faq")}</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-md">
                    <p className="text-gray-900 whitespace-pre-wrap">{group.faq}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Group Image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("supportGroup.groupImage")}</h2>
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={group.imageUrl || "/placeholder.svg"}
                  alt="Support Group"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("supportGroup.actions")}</h2>
              <div className="space-y-3">
                <button
                  onClick={toggleApproval}
                  disabled={group.approval_status || updating}
                  className={`w-full flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${group.approval_status
                    ? 'bg-green-100 text-green-600 border border-green-300 cursor-not-allowed'
                    : updating
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                    }`}
                >
                  {group.approval_status ? (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {t("supportGroup.approved")}
                    </>
                  ) : updating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t("supportGroup.updating")}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {t("supportGroup.approveGroup")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
