"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddNewEmployeeDialog from "./AddNewEmployeeDialog";
import TeamsView from "./TeamsView";
import EmployeesView from "./EmployeesView";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiBaseUrl } from "../../../../const";
import UnifiedPagination from "@/features/home/components/UnifiedPagination";
import AddNewTeamDialog from "./AddNewTeamDialog";
import { EmployeeItemType, TeamItemType } from "../types/permission.type";

export default function PermissionPage() {
  const searchParams = useSearchParams();

  const [teams, setTeams] = useState<TeamItemType[]>([]);
  const [employees, setEmployees] = useState<EmployeeItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Read page/pageSize from the URL, or fallback to 1 / 9
  const pageParam = searchParams.get("page");
  const pageSizeParam = searchParams.get("pageSize");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;
  const [total, setTotal] = useState(0); // track total items

  useEffect(() => {
    let isMounted = true;

    async function fetchTeams() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/admin/teams?page=${currentPage}&pageSize=${pageSize}`
        ); // Adjust your baseURL if needed
        if (!res.ok) {
          throw new Error(`Failed to fetch. Status: ${res.status}`);
        }
        const data = await res.json();

        if (isMounted) {
          setTeams(Array.isArray(data.data) ? data.data : []);
          setTotal(data.total);
        }
      } catch (err: any) {
        console.error("Failed to fetch teams:", err);
        if (isMounted) {
          setError("Error fetching teams.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchTeams();

    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize]);
  console.log("update teamt", teams);

  useEffect(() => {
    let isMounted = true;
    async function fetchEmployees() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/admin/employees?page=${currentPage}&pageSize=${pageSize}`
        ); // Adjust baseURL if needed
        if (!res.ok) {
          throw new Error(`Failed to fetch. Status: ${res.status}`);
        }
        const data = await res.json();
        console.log("employee data", data);
        if (isMounted) {
          setEmployees(Array.isArray(data.data) ? data.data : []);
          setTotal(data.total);
        }
      } catch (err: any) {
        console.error("Failed to fetch employees:", err);
        if (isMounted) {
          setError("Error fetching employees.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchEmployees();

    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize]);

  console.log("members", employees);
  console.log("temas", teams);

  return (
    <section>
      <div>
        <Tabs defaultValue="team" className="w-full">
          <div className="flex justify-between w-full">
            <TabsList className="justify-start h-auto p-0 bg-background flex flex-row flex-wrap">
              <TabsTrigger
                value="team"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Teams
              </TabsTrigger>
              <TabsTrigger
                value="employee"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Employees
              </TabsTrigger>
            </TabsList>
            <div className="flex flex-row gap-2">
              <AddNewTeamDialog employees={employees} teams={teams} />
              <AddNewEmployeeDialog teams={teams} />
            </div>
          </div>

          <TabsContent value="team">
            <TeamsView teams={teams} />
          </TabsContent>

          <TabsContent value="employee">
            <EmployeesView employees={employees} />
          </TabsContent>
        </Tabs>
        <UnifiedPagination total={total} />
      </div>
    </section>
  );
}
