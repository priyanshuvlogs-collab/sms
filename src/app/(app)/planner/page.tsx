import { CalendarDays } from "lucide-react";
import { ModuleStub } from "@/components/app/module-stub";

export const metadata = { title: "Planner" };

export default function PlannerPage() {
  return (
    <ModuleStub
      icon={CalendarDays}
      title="Planner"
      phase={4}
      description="Calendar with statuses and CSV export for Buffer or Late. No native posting — that's what keeps this $9. Shipping in Phase 4."
    />
  );
}
