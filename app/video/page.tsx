import { Metadata } from "next";
import { baseURL } from "@/baseUrl";
import { VideoRedirect } from "./video-redirect";

export const metadata: Metadata = {
  title: "Fineance",
  description: "Use ChatGPT for planning your personal finances",
  openGraph: {
    title: "Fineance",
    description: "Use ChatGPT for planning your personal finances",
    images: [
      {
        url: `${baseURL}/videoscreenshot.png`,
        width: 1200,
        height: 630,
        alt: "Fineance - Personal Financial Planning with ChatGPT",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fineance",
    description: "See how to use ChatGPT for planning your personal finances",
    images: [`${baseURL}/videoscreenshot.png`],
  },
};

export default function VideoPage() {
  return <VideoRedirect />;
}
