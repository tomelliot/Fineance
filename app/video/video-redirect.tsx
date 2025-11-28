"use client";

import { useEffect } from "react";

const VIDEO_URL =
  "https://player.mux.com/NxqpX01iOTvfAYsLZeZfjW9nmn62b02rBeAzjVzWtX2K4?metadata-video-title=Fineance&video-title=Fineance&accent-color=%23ff6b36";

export function VideoRedirect() {
  useEffect(() => {
    window.location.href = VIDEO_URL;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted">Redirecting to video...</p>
    </div>
  );
}

