import { Construction } from "lucide-react";

export default function UnderDevelopment({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">This section is part of the studio console.</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/10 bg-card/40 px-6 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-gold/80">
          <Construction className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold">Under Development</h2>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            {description ||
              "This module is being built. It will be available in an upcoming release."}
          </p>
        </div>
      </div>
    </div>
  );
}
