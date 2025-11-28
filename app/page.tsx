export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 md:p-12">
      <main className="max-w-3xl w-full space-y-12">
        <h1 className="text-6xl md:text-7xl tracking-tight leading-none text-accent ">
          <span className="italic font-bold [text-shadow:4px_4px_0px_rgba(0,0,0,0.6)]">
            Fine
          </span>

          <span className="font-light [text-shadow:2px_2px_0px_rgba(0,0,0,0.5)]">
            ance
          </span>
        </h1>
        <p className="text-xl text-muted">
          Personal Financial Planning ChatGPT App
        </p>
      </main>
    </div>
  );
}
