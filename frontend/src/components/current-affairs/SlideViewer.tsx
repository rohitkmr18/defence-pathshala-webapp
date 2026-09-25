"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Layers } from "lucide-react";
import type { CurrentAffairsSlide } from "@/lib/current-affairs";

interface SlideViewerProps {
  slides: CurrentAffairsSlide[];
  title?: string;
}

export default function SlideViewer({ slides, title }: SlideViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = slides.length;
  const currentSlide = slides[currentIndex];

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
    setImageLoaded(false);
  }, [total]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
    setImageLoaded(false);
  }, [total]);

  const goToSlide = (idx: number) => {
    if (idx >= 0 && idx < total) {
      setCurrentIndex(idx);
      setImageLoaded(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!slides || slides.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <Layers className="h-12 w-12 text-slate-400" />
        <p className="mt-3 text-base font-semibold text-slate-700">
          No slides uploaded for this day yet.
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Upload slides from the publisher portal to view today&apos;s brief.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Slide counter bar */}
      <div className="flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 font-bold text-white shadow-2xs">
            Slide {currentIndex + 1} of {total}
          </span>
          {title && (
            <span className="hidden font-medium text-slate-500 sm:inline truncate max-w-sm">
              {title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="hidden text-[11px] sm:inline">
            Swipe or use ← → arrow keys
          </span>
        </div>
      </div>

      {/* Main Slide Carousel Container */}
      <div
        className="group relative select-none overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-2xl transition-all duration-300"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900 animate-pulse text-slate-400">
            <Layers className="h-8 w-8 animate-bounce text-blue-500" />
            <span className="mt-2 text-xs font-semibold">Loading slide...</span>
          </div>
        )}

        {/* Slide Image */}
        <div className="relative flex min-h-[420px] sm:min-h-[580px] w-full items-center justify-center bg-black">
          <img
            key={currentSlide.imageUrl}
            src={currentSlide.imageUrl}
            alt={`Slide ${currentIndex + 1}`}
            onLoad={() => setImageLoaded(true)}
            className={`max-h-[640px] w-auto max-w-full object-contain transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Previous Button Overlay */}
        <button
          type="button"
          onClick={goToPrev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all duration-200 hover:bg-black/90 hover:scale-105 active:scale-95 z-20 shadow-lg"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Next Button Overlay */}
        <button
          type="button"
          onClick={goToNext}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all duration-200 hover:bg-black/90 hover:scale-105 active:scale-95 z-20 shadow-lg"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Slide Thumbnail Navigation Dots */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
        {slides.map((slide, idx) => (
          <button
            key={slide.slideNumber || idx}
            type="button"
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 transition-all duration-200 rounded-full ${
              idx === currentIndex
                ? "w-8 bg-blue-600"
                : "w-2 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
