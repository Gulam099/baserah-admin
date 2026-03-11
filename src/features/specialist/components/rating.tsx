"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Info, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { fetchSpecRatingRecords } from "../utils/specialist.util";
import UnifiedPagination from "@/features/home/components/UnifiedPagination";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ApiBaseUrlLocal } from "../../../../const";
import axios from "axios";

export default function Rating(props: { doctorId: string }) {
  const { doctorId } = props;
  console.log("doctor???", doctorId);
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const pageSizeParam = searchParams.get("pageSize");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;

  const [ratings, setRatings] = useState<any[]>();
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [averageRating, setAverageRating] = useState<string | null>(null);
  useEffect(() => {
    async function fetchRatings() {
      try {
        setLoading(true);
        const res = await axios.get(
          `${ApiBaseUrlLocal}/api/ratings/doctor/${doctorId}?page=${currentPage}&pageSize=${pageSize}`
        );

        setRatings(res.data.records || []);
        setTotal(res.data.page?.total || 0);
        setAverageRating(res.data.averageRating ?? null);
      } catch (err) {
        console.error("Failed to fetch ratings:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRatings();
  }, [doctorId, currentPage, pageSize]);

  if (loading) {
    return (
      <div className="flex flex-row w-full h-full min-h-[80svh] justify-center items-center">
        <Loader2 className="animate-spin mx-2" /> {t("loading")}
      </div>
    );
  }

  // if (!ratings || ratings.length === 0) {
  //   return <div>{t("noRatingsFound")}</div>;
  // }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">


        {/* <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-center">
              {total}
            </CardTitle>
            <CardDescription className="text-center">
              {t("totalRatings")}
            </CardDescription>
          </CardHeader>
        </Card> */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-center">
              {averageRating} ⭐
            </CardTitle>
            <CardDescription className="text-center">
              {t("averageRating")}
            </CardDescription>
          </CardHeader>
        </Card>

      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ratings.map((rating, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">
                    {rating.name || `Patient ${index + 1}`}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(rating.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{rating.rating} ⭐</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Info className="h-4 w-4" />
                        <span className="sr-only">
                          {t("showRatingDetails")}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <div className="p-4 space-y-4">
                        {rating.details &&
                          Object.entries(
                            rating.details as Record<string, string>
                          ).map(([key, value]) => (
                            <div key={key} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="capitalize">
                                  {t(`ratingKeys.${key}`)}
                                </span>
                                <span>{value}%</span>
                              </div>
                              <Progress
                                value={Number(value)}
                                className="h-2"
                              />
                            </div>
                          ))}
                        {rating.review && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                              {rating.review}
                            </p>
                          </div>
                        )}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div> */}

      <UnifiedPagination total={total} />
    </div>
  );
}
