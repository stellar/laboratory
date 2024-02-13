import { LayoutSidebar } from "@/components/LayoutSidebar";

export default function LayoutWithSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutSidebar>{children}</LayoutSidebar>;
}
