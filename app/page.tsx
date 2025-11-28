import MuxPlayer from "@mux/mux-player-react";
import { CopyButton } from "./components/copy-button";

export default function Home() {
  const url = "https://fineance.tomelliot.net/mcp";

  return (
    <div className="min-h-screen flex items-center justify-center p-8 md:p-12">
      <main className="max-w-3xl w-full space-y-36">
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl tracking-tight leading-none text-accent ">
            <span className="italic font-bold [text-shadow:4px_4px_0px_rgba(0,0,0,0.6)]">
              Fine
            </span>

            <span className="font-light [text-shadow:2px_2px_0px_rgba(0,0,0,0.5)]">
              ance
            </span>
          </h1>
          <p className="text-xl text-muted">Plan your finances with ChatGPT</p>
        </div>
        <div className="space-y-6 animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
          <h2 className="text-3xl md:text-4xl font-bold text-accent">Demo</h2>
          <MuxPlayer
            streamType="on-demand"
            playbackId="NxqpX01iOTvfAYsLZeZfjW9nmn62b02rBeAzjVzWtX2K4"
            metadata={{
              video_id: "kfyUfKLmF466lLh9vVEbQ8ANpfti5YkvxMdF02rufd4s",
              video_title: "Fineance",
            }}
            accentColor="#00d4ff"
            thumbnailTime={200}
            className="rounded-2xl overflow-hidden max-w-96"
          />
        </div>
        <div className="space-y-6 animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
          <h2 className="text-3xl md:text-4xl font-bold text-accent">
            Installation
          </h2>
          <div className="rounded-2xl p-8 md:p-10 space-y-6 border-2 bg-muted border-accent/30 [box-shadow:0_8px_32px_rgba(139,69,19,0.08)]">
            <p className="text-base md:text-lg text-foreground opacity-80">
              To use Fineance in ChatGPT, add it as a connector:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-base md:text-lg ml-2">
              <li>Open ChatGPT and go to Settings</li>
              <li>Navigate to Connectors</li>
              <li>Click "Add Connector"</li>
              <li>Enter the following URL:</li>
            </ol>
            <div className="relative group">
              <div className="rounded-lg p-4 pr-12 text-sm md:text-base break-all border-2 bg-background border-accent text-accent font-mono tracking-[0.5px]">
                {url}
              </div>
              <CopyButton text={url} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
