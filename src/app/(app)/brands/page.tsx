import { Palette } from "lucide-react";
import { ModuleStub } from "@/components/app/module-stub";

export const metadata = { title: "Brand Kit" };

export default function BrandsPage() {
  return (
    <ModuleStub
      icon={Palette}
      title="Brand Kit"
      phase={2}
      description="Voice, offer, ICP, competitors, CTA, and banned words — set once, read by every generation. Shipping in Phase 2 alongside quota enforcement and BYOK."
    />
  );
}
