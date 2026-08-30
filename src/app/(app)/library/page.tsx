import { BookMarked } from "lucide-react";
import { ModuleStub } from "@/components/app/module-stub";

export const metadata = { title: "Library" };

export default function LibraryPage() {
  return (
    <ModuleStub
      icon={BookMarked}
      title="Library"
      phase={4}
      description="Your saved winners plus 50 prompt recipes. Anything you generate can be saved here in one click. Shipping in Phase 4."
    />
  );
}
