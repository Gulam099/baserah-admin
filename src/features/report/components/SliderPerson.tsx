import * as React from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight2, ExportCurve } from "iconsax-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function SliderPerson(props: {
  className?: string;
  title: string;
  data: { name: string; session: number; performance: number; image: string }[];
  desc: string;
  viewMoreLink?: string;
}) {
  const { className, title, data, desc, viewMoreLink } = props;
  return (
    <Card className={cn(className, "flex flex-col ")}>
      <CardHeader className="items-center pb-0">
        <div className="flex flex-row justify-between items-center w-full">
          <CardTitle className="text-sm font-semibold text-neutral-600 ">
            {title}
            <p className="text-xs font-medium mt-2">{desc}</p>
          </CardTitle>
          {viewMoreLink && (
            <Link
              href={viewMoreLink}
              className="flex flex-row gap-1 text-sm items-center"
            >
              View More <ArrowRight2 size={18} />
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="py-12">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full max-w-[85%] mx-auto"
        >
          <CarouselContent className=" flex justify-center items-center">
            {data.map((item, index) => (
              <CarouselItem key={index} className=" md:basis-1/2 lg:basis-1/5 ">
                <div className="p-0 flex flex-col gap-2 justify-center items-center">
                  <Avatar className="size-24">
                    <AvatarImage src={item.image} alt={item.name + "_avatar"} />
                    <AvatarFallback>{item.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm">{item.name}</p>
                  <p className="text-xs">{item.session} sessions</p>
                  <Badge className="" variant={"secondary"}>
                    {item.performance}%
                  </Badge>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
