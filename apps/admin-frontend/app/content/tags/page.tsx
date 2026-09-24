"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@corpora/ui";
import { TagsTable } from "@/components/tags/tags-table";
import { AddEditTagDialog } from "@/components/tags/dialogs/add-edit-tag-dialog";
import { MOCK_TAGS, Tag } from "@/components/tags/mock-data";

export default function TagsPage() {
    const [tags, setTags] = React.useState<Tag[]>(MOCK_TAGS);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedTag, setSelectedTag] = React.useState<Tag | undefined>(undefined);
    const [isSaving, setIsSaving] = React.useState(false);

    const handleCreateClick = () => {
        setSelectedTag(undefined);
        setIsDialogOpen(true);
    };

    const handleEditClick = (tag: Tag) => {
        setSelectedTag(tag);
        setIsDialogOpen(true);
    };

    const handleToggleActive = (id: string) => {
        setTags(prev => prev.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
    };

    const handleDelete = (id: string) => {
        // Soft delete: set isActive to false
        setTags(prev => prev.map(t => t.id === id ? { ...t, isActive: false } : t));
    };

    const handleSubmit = async (data: any) => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (selectedTag) {
            // Update
            setTags(prev => prev.map(t => t.id === selectedTag.id ? { ...t, ...data } : t));
        } else {
            // Create
            const newTag: Tag = {
                id: `TAG-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                ...data
            };
            setTags(prev => [newTag, ...prev]);
        }
        
        setIsSaving(false);
        setIsDialogOpen(false);
    };

    return (
        <DashboardLayout 
            title="Content & Structure" 
            subtitle="Tags Management"
            breadcrumbs={[
                { label: "Content", href: "/content/categories" },
                { label: "Tags", active: true }
            ]}
        >
            <div className="flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Product Tags</h1>
                        <p className="text-muted-foreground mt-1 text-sm font-medium">
                            Categorize and label products with descriptive keywords for better search.
                        </p>
                    </div>
                    <Button 
                        onClick={handleCreateClick}
                        className="gap-2 rounded-full h-11 px-6 shadow-lg shadow-primary/20"
                    >
                        <Plus className="h-4 w-4" /> Create Tag
                    </Button>
                </div>

                <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                    <TagsTable 
                        data={tags} 
                        onEdit={handleEditClick}
                        onDelete={handleDelete}
                        onToggleActive={handleToggleActive}
                    />
                </div>
            </div>

            <AddEditTagDialog 
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                tag={selectedTag}
                onSubmit={handleSubmit}
                isLoading={isSaving}
            />
        </DashboardLayout>
    );
}
