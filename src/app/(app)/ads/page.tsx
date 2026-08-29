import { Megaphone } from "lucide-react";
import { ModuleStub } from "@/components/app/module-stub";

export const metadata = { title: "Ads Workshop" };

export default function AdsPage() {
  return (
    <ModuleStub
      icon={Megaphone}
      title="Ads Workshop"
      phase={5}
      description="8 ad angles from one offer, with Meta and Google compliance hints. Shipping in Phase 5."
    />
  );
}
