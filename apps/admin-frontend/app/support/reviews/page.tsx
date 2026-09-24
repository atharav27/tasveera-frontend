"use client";

import * as React from "react";
import { FilterX } from "lucide-react";
import { useRouter } from "next/navigation";

import { DashboardLayout } from "@/components/dashboard-layout";
import { 
    Button, 
    TableTopBar,
    FormSelectField
} from "@corpora/ui";
import { useForm } from "react-hook-form";
import { ReviewsTable } from "@/components/reviews/reviews-table";
import { MOCK_REVIEWS, Review } from "@/components/reviews/mock-data";

export default function ReviewsQueuePage() {
    const router = useRouter();
    const [reviews, setReviews] = React.useState<Review[]>(MOCK_REVIEWS);
    
    const [activeTab, setActiveTab] = React.useState<"PENDING" | "APPROVED" | "ALL">("PENDING");

    // Derived products for filter dropdown
    const uniqueProducts = React.useMemo(() => {
        const map = new Map();
        reviews.forEach(r => map.set(r.product.id, r.product.title));
        return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
    }, [reviews]);

    const { control, watch, reset } = useForm({
        defaultValues: {
            filterRating: "ALL",
            filterProduct: "ALL"
        }
    });

    const filterRating = watch("filterRating");
    const filterProduct = watch("filterProduct");

    const filteredReviews = React.useMemo(() => {
        return reviews.filter(r => {
            // Tab filtering
            if (activeTab === "PENDING" && r.isApproved) return false;
            if (activeTab === "APPROVED" && !r.isApproved) return false;

            // Rating filtering
            if (filterRating !== "ALL" && r.rating.toString() !== filterRating) return false;

            // Product filtering
            if (filterProduct !== "ALL" && r.product.id !== filterProduct) return false;

            return true;
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [reviews, activeTab, filterRating, filterProduct]);

    // Mutation Handlers
    const handleApprove = (id: string) => {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, isApproved: true } : r));
    };

    const handleReject = (id: string) => {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, isApproved: false } : r));
    };

    const handleDelete = (id: string) => {
        setReviews(prev => prev.filter(r => r.id !== id));
    };

    return (
        <DashboardLayout 
            title="Support" 
            subtitle="Reviews Moderation"
            breadcrumbs={[
                { label: "Support", href: "/support/reviews" },
                { label: "Reviews Queue", active: true }
            ]}
        >
            <div className="space-y-6 max-w-7xl mx-auto">
                
                {/* TABS */}
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <button 
                        onClick={() => setActiveTab("PENDING")}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'PENDING' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
                    >
                        Pending Priority
                    </button>
                    <button 
                        onClick={() => setActiveTab("APPROVED")}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'APPROVED' ? 'bg-green-100 text-green-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
                    >
                        Approved
                    </button>
                    <button 
                        onClick={() => setActiveTab("ALL")}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
                    >
                        Master Queue
                    </button>
                </div>

                {/* FILTERS */}
                <div className="bg-card border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-end gap-4 border-slate-200">
                    <div className="flex-1 w-full relative -top-1">
                        <FormSelectField
                            control={control}
                            name="filterRating"
                            label="Rating"
                            options={[
                                { label: "All Ratings", value: "ALL" },
                                { label: "5 Stars", value: "5" },
                                { label: "4 Stars", value: "4" },
                                { label: "3 Stars", value: "3" },
                                { label: "2 Stars", value: "2" },
                                { label: "1 Star", value: "1" },
                            ]}
                            className="h-11 rounded-xl bg-slate-50 border-slate-200"
                        />
                    </div>

                    <div className="flex-1 w-full relative -top-1">
                        <FormSelectField
                            control={control}
                            name="filterProduct"
                            label="Product Reference"
                            options={[
                                { label: "All Products", value: "ALL" },
                                ...uniqueProducts.map(p => ({ label: p.title, value: p.id }))
                            ]}
                            className="h-11 rounded-xl bg-slate-50 border-slate-200 truncate"
                        />
                    </div>

                    <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-11 w-11 rounded-xl hover:bg-slate-100 shrink-0"
                        onClick={() => reset()}
                    >
                        <FilterX className="h-4 w-4" />
                    </Button>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Queue Output</h3>
                        <p className="text-sm text-slate-500 font-medium">Found {filteredReviews.length} records matching criteria.</p>
                    </div>
                    
                    <ReviewsTable 
                        data={filteredReviews}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
