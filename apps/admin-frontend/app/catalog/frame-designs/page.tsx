"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { TableTopBar, StatCard } from "@corpora/ui";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FrameDesignsTable } from "@/components/frame-designs/frame-designs-table";
import { MOCK_FRAME_DESIGNS, FRAME_DESIGN_STATS, FrameDesign } from "@/components/frame-designs/mock-data";

export default function FrameDesignsListPage() {
  const router = useRouter();
  const [designs, setDesigns] = useState<FrameDesign[]>(MOCK_FRAME_DESIGNS);

  const handleDelete = (id: string) => {
    setDesigns(prev => prev.filter(p => p.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setDesigns(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const statCards = [
    { title: "Total Designs", value: FRAME_DESIGN_STATS.TOTAL.toString(), trend: { value: "0%", label: "growth", type: "neutral" as const } },
    { title: "Active", value: FRAME_DESIGN_STATS.ACTIVE.toString(), trend: { value: "0%", label: "availability", type: "neutral" as const } },
  ];

  return (
    <DashboardLayout 
      title="Frame Designs" 
      subtitle="Manage styles and finishes for frames"
      breadcrumbs={[
        { label: "Catalog", href: "/catalog/products" },
        { label: "Frame Designs", active: true }
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="rounded-2xl bg-card shadow-sm p-8">
        <TableTopBar
          title="Frame Designs"
          subtitle="View and manage all frame designs in your catalog"
          buttons={[
            {
              text: "Create Design",
              icon: <Plus className="size-4" />,
              variant: "default",
              className: "rounded-full h-11 px-6",
              onClick: () => router.push("/catalog/frame-designs/create"),
            },
          ]}
          className="mb-8"
        />

        <FrameDesignsTable
            data={designs}
            pageCount={1}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
        />
      </div>
    </DashboardLayout>
  );
}
