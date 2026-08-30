import { PenLine } from "lucide-react";
import { ModuleStub } from "@/components/app/module-stub";

export const metadata = { title: "Content Engine" };

export default function ContentPage() {
  return (
    <ModuleStub
      icon={PenLine}
      title="Content Engine"
      phase={4}
      description="Hooks, posts, threads, captions — and repurpose one long asset into 15 shorts. Shipping in Phase 4."
    />
  );
}
