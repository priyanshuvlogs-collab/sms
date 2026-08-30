import { Search } from "lucide-react";
import { ModuleStub } from "@/components/app/module-stub";

export const metadata = { title: "SEO Briefs" };

export default function SeoPage() {
  return (
    <ModuleStub
      icon={Search}
      title="SEO Briefs"
      phase={5}
      description="Keyword → brief, cluster builder, and an on-page draft score. No paid SEO APIs — optional BYO SerpApi comes later. Shipping in Phase 5."
    />
  );
}
