"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExportCurve } from "iconsax-react";
import { cn } from "@/lib/utils";

import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";

// Types for the component props
interface MapCompProps {
  className?: string;
  title: string;
  satisfaction?: number;
  comments?: number | string;
  dataPoints: {
    label: string;
    coordinates: [number, number];
    color?: string;
  }[];

  legend: {
    label: string;
    color: string;
  }[];
}

export default function MapComp({
  className,
  title,
  satisfaction = 98,
  comments = 23000,
  dataPoints = [],
  legend = [],
}: MapCompProps) {
  // references for the map container and map instance
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);

  // configure map defaults
  const initialCenter = { lng: 0, lat: 20 };
  const [zoom] = useState(2);

  // set your MapTiler API key here:
  maptilersdk.config.apiKey = "dOlk4ZUm9OB29jfh1l5C";

  // initialize the map once
  useEffect(() => {
    if (map.current) return; // stops map from re-initializing

    map.current = new maptilersdk.Map({
      container: mapContainer.current as HTMLDivElement,
      style: maptilersdk.MapStyle.DATAVIZ.LIGHT,
      center: [initialCenter.lng, initialCenter.lat],
      zoom: zoom,
    });

    // Add markers to the map
    dataPoints.forEach((marker) => {
      new maptilersdk.Marker({
        color: marker.color || "#0035d7", // fallback color
      })
        .setLngLat(marker.coordinates)
        .addTo(map.current!);
    });
  }, [dataPoints, initialCenter, zoom]);

  return (
    <Card className={cn("flex flex-col grow", className)}>
      <CardHeader className="pb-0">
        <div className="flex flex-row items-center justify-between w-full">
          {/* Title + Satisfaction */}
          <CardTitle className="text-sm font-semibold text-neutral-600 flex items-center gap-2">
            {title}
            <span className="text-base text-blue-600 font-bold">
              {satisfaction}%
            </span>
          </CardTitle>
          {/* Export / Download button */}
          <Button className="aspect-square" variant="ghost">
            <ExportCurve size="20" color="#0a0a0a" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <div className="w-full h-[400px] md:h-[500px]">
          <div ref={mapContainer} className="w-full h-full" />
        </div>
      </CardContent>

      <CardFooter className="flex flex-row items-center justify-between gap-4 py-6">
        {/* Legend items */}
        <div className="flex flex-wrap items-center gap-4">
          {legend.map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              <span
                className="inline-block w-2 h-2 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs">{item.label}</span>
            </div>
          ))}
        </div>
        {/* Comments */}
        <div className="text-xs text-muted-foreground">{comments} Comments</div>
      </CardFooter>
    </Card>
  );
}
