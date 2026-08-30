import { FileText } from "lucide-react";
import { ModuleStub } from "@/components/app/module-stub";

export const metadata = { title: "Reports" };

export default function ReportsPage() {
  return (
    <ModuleStub
      icon={FileText}
      title="Weekly Report Lite"
      phase={5}
      description="Paste your numbers, get a one-page client report PDF you can forward. No email sending — you stay in control of the send. Shipping in Phase 5."
    />
  );
}
