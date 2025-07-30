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

export default function Rating(props: { specilaistId: string }) {
  const { specilaistId } = props;
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const pageSizeParam = searchParams.get("pageSize");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;

  const [ratings, setRatings] = useState<any[]>();
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchSpecRatingRecords(specilaistId, currentPage, pageSize)
      .then((res) => {
        setRatings(res.data!);
        setTotal(res.page?.total!);
      })
      .catch((err) => {
        console.error("Failed to fetch ratings:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, pageSize]);

  if (loading) {
    return (
      <div className="flex flex-row w-full h-full min-h-[80svh] justify-center items-center">
        <Loader2 className="animate-spin mx-2" /> {t("loading")}
      </div>
    );
  }

  if (!ratings) {
    return <div>{t("noRatingsFound")}</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-center">
              {total}
            </CardTitle>
            <CardDescription className="text-center">
              {t("totalRatings")}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {ratings.map((rating, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{rating.name}</h3>
                  <p className="text-sm text-muted-foreground">{rating.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{rating.rating}%</span>
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
                        {Object.entries(
                          rating.details as Record<string, string>
                        ).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize">
                                {t(`ratingKeys.${key}`)}
                              </span>
                              <span>{value}%</span>
                            </div>
                            <Progress value={Number(value)} className="h-2" />
                          </div>
                        ))}
                        {rating.comment && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                              {rating.comment}
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
      </div>
      <UnifiedPagination total={total} />
    </div>
  );
}
