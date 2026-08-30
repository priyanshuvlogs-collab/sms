import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * Honest placeholder for modules that ship in later phases.
 * No fake buttons, no dead ends — says exactly what's coming.
 */
export function ModuleStub({
  icon: Icon,
  title,
  description,
  phase,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  phase: number;
}) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <Badge variant="outline" className="font-mono">
          Phase {phase}
        </Badge>
      </div>
      <div className="mt-10 flex flex-col items-center rounded-lg border border-dashed border-border px-6 py-16 text-center">
        <Icon className="size-8 text-primary" aria-hidden />
        <p className="mt-4 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
