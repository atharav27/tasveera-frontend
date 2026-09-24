"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ListOrdered, Table as TableIcon } from "lucide-react";

import {
  DashboardLayout,
} from "@/components/dashboard-layout";
import {
  TableTopBar,
} from "@corpora/ui";

import { MOCK_CATEGORIES, Category } from "@/components/categories/mock-data";
import { CategoriesTable } from "@/components/categories/categories-table";
import { CategoriesReorder } from "@/components/categories/categories-reorder";

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = (id: string) => {
    // Soft delete: set isActive to false
    setCategories(prev => prev.map(c => c.id === id ? { ...c, isActive: false } : c));
  };

  const handleSaveOrder = async (orderedIds: string[]) => {
    setIsUpdating(true);
    // Simulate API reorder
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newOrder = [...categories].sort((a, b) => {
        return orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id);
    }).map((c, i) => ({ ...c, sortOrder: i + 1 }));
    
    setCategories(newOrder);
    setIsReorderMode(false);
    setIsUpdating(false);
  };

  return (
    <DashboardLayout
      title="Content & Structure"
      subtitle="Manage Categories"
      breadcrumbs={[
        { label: "Content", href: "/content/categories" },
        { label: "Categories", active: true }
      ]}
    >
      <div className="space-y-6">
        <TableTopBar
          title={isReorderMode ? "Arrange Categories" : "All Categories"}
          subtitle={isReorderMode ? "Drag items to change menu priority." : "Manage navigation and product groups."}
          buttons={[
            {
              text: isReorderMode ? "List View" : "Reorder Categories",
              icon: isReorderMode ? <TableIcon className="h-4 w-4" /> : <ListOrdered className="h-4 w-4" />,
              variant: "outline",
              className: "rounded-full h-11 px-6 shadow-sm border-slate-200",
              onClick: () => setIsReorderMode(!isReorderMode)
            },
            {
              text: "Create Category",
              icon: <Plus className="h-4 w-4" />,
              variant: "default",
              className: "rounded-full h-11 px-6 shadow-md",
              onClick: () => router.push("/content/categories/create")
            }
          ]}
        />

        {isReorderMode ? (
            <CategoriesReorder 
                items={categories} 
                onSave={handleSaveOrder} 
                isLoading={isUpdating}
            />
        ) : (
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <CategoriesTable 
                    data={categories} 
                    onDelete={handleDelete}
                />
            </div>
        )}
      </div>
    </DashboardLayout>
  );
}
