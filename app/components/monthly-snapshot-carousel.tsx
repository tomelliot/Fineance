"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { SnapshotCard } from "./snapshot-card";
import { MonthlySnapshot as MonthlySnapshotType } from "@/services/snapshots";

interface MonthlySnapshotCarouselProps {
  snapshots: MonthlySnapshotType[];
}

export function MonthlySnapshotCarousel({
  snapshots,
}: MonthlySnapshotCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();

  // Start at the last slide (most recent month)
  useEffect(() => {
    if (!api) return;

    // Wait for carousel to be ready, then scroll to the last slide
    const slideCount = api.scrollSnapList().length;
    if (slideCount > 0) {
      // Use requestAnimationFrame to ensure carousel is fully initialized
      requestAnimationFrame(() => {
        api.scrollTo(slideCount - 1, true); // true = jump (no animation)
      });
    }
  }, [api]);

  if (snapshots.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full overflow-visible">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full overflow-visible"
      >
        <CarouselContent className="-ml-4">
          {snapshots.map((snapshot) => (
            <CarouselItem key={snapshot.month} className="pl-4">
              <div className="py-16 px-16">
                <SnapshotCard snapshot={snapshot} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
