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

export default function Rating(props: {
  searchParams: { [key: string]: string };
}) {
  const { searchParams } = props;
  // Read page/pageSize from the URL, or fallback to 1 / 9
  const pageParam = searchParams.page;
  const pageSizeParam = searchParams.pageSize;
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;

  const [ratings, setRatings] = useState<any[]>();
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchSpecRatingRecords(currentPage, pageSize)
      .then((res) => {
        setRatings(res.data!);
        setTotal(res.page?.total!);
      })
      .catch((err) => {
        console.error("Failed to fetch questions:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, pageSize]);

  if (loading) {
    return (
      <div className="flex flex-row  w-full h-full min-h-[80svh] justify-center items-center">
        <Loader2 className="animate-spin mx-2" /> Loading...
      </div>
    );
  }

  if (!ratings) {
    return <div>No Ratings found.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-center">
              120
            </CardTitle>
            <CardDescription className="text-center">
              Negative evaluation
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-center">
              1350
            </CardTitle>
            <CardDescription className="text-center">
              Positive evaluation
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-center">
              14325
            </CardTitle>
            <CardDescription className="text-center">
              Total ratings
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-gradient-to-r from-blue-600 to-blue-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-center text-white">
              98%
            </CardTitle>
            <CardDescription className="text-center text-white">
              Overall assessment
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Individual Ratings */}
      <div className=" grid grid-cols-3 gap-4">
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
                        <span className="sr-only">Show rating details</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <div className="p-4 space-y-4">
                        {Object.entries(rating.details).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </span>
                              <span>{value}%</span>
                            </div>
                            <Progress value={value} className="h-2" />
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
