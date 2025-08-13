"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { ApiBaseUrlLocal } from "../../../../const";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function GroupPage() {
  const { t } = useTranslation();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(`${ApiBaseUrlLocal}/api/support-groups/get-all`);
        setGroups(res.data.data ?? []);
      } catch (err) {
        console.error("Failed to fetch groups:", err);
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) return <p>{t("groupPage.loading")}</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">{t("groupPage.title")}</h1>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("groupPage.table.title")}</TableHead>
              <TableHead>{t("groupPage.table.type")}</TableHead>
              <TableHead>{t("groupPage.table.module")}</TableHead>
              <TableHead>{t("groupPage.table.cost")}</TableHead>
              <TableHead>{t("groupPage.table.createdAt")}</TableHead>
              <TableHead>{t("groupPage.table.action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  {t("groupPage.table.noGroups")}
                </TableCell>
              </TableRow>
            ) : (
              groups.map((group: any) => (
                <TableRow key={group._id}>
                  <TableCell>{group.title}</TableCell>
                  <TableCell>{group.type}</TableCell>
                  <TableCell>{group?.module}</TableCell>
                  <TableCell>{group.cost}</TableCell>
                  <TableCell>
                    {group.createdAt
                      ? format(parseISO(group.createdAt), "dd MMM yyyy HH:mm")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/dashboard/group/${group._id}`)}
                    >
                      {t("groupPage.table.edit")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
