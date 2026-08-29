import { Rocket } from "lucide-react";
import { ModuleStub } from "@/components/app/module-stub";

export const metadata = { title: "Campaign Studio" };

export default function CampaignsPage() {
  return (
    <ModuleStub
      icon={Rocket}
      title="Campaign Studio"
      phase={3}
      description="One goal + one offer in → positioning, 7-day calendar, platform-native posts, Meta + Google ads, landing outline, 3-email sequence, Shorts titles, and a UTM set. The hero module — first generator to ship."
    />
  );
}
