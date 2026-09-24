"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Star, ExternalLink, ShieldCheck, ShieldAlert, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button, StatusBadge, Card, CardContent, CommonAlertDialog } from "@corpora/ui";
import { MOCK_REVIEWS, Review } from "@/components/reviews/mock-data";
import Link from "next/link";

export default function ReviewDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    
    const [review, setReview] = React.useState<Review | undefined>(
        MOCK_REVIEWS.find(r => r.id === id)
    );
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    if (!review) {
        return (
            <DashboardLayout title="Not Found">
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    <p className="text-lg font-bold text-slate-900 mb-2">Review Not Found</p>
                    <p className="text-sm text-slate-500 mb-6 max-w-sm">This record may have been permanently purged or does not exist.</p>
                    <Button onClick={() => router.push("/support/reviews")} className="rounded-full px-8 shadow-sm">Return to Queue</Button>
                </div>
            </DashboardLayout>
        );
    }

    const handleApprove = async () => {
        setIsUpdating(true);
        await new Promise(r => setTimeout(r, 800)); // Simulate PATCH
        setReview({ ...review, isApproved: true });
        setIsUpdating(false);
    };

    const handleReject = async () => {
        setIsUpdating(true);
        await new Promise(r => setTimeout(r, 800)); // Simulate PATCH
        setReview({ ...review, isApproved: false });
        setIsUpdating(false);
    };

    const handleDelete = async () => {
        // Simulate DELETE
        await new Promise(r => setTimeout(r, 1000));
        router.push("/support/reviews");
    };

    return (
        <DashboardLayout 
            title="Review Details" 
            subtitle={`Record ID: ${review.id}`}
            breadcrumbs={[
                { label: "Support", href: "/support/reviews" },
                { label: "Reviews Queue", href: "/support/reviews" },
                { label: review.id, active: true }
            ]}
        >
            <div className="mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/support/reviews")}
                    className="gap-2 font-semibold px-0 hover:bg-transparent text-slate-500 hover:text-slate-900"
                >
                    <ChevronLeft className="h-4 w-4" /> Back to Queue
                </Button>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* STATUS BAR */}
                <Card className="rounded-[1.5rem] border-slate-200/60 shadow-sm overflow-hidden bg-slate-50/50">
                    <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <StatusBadge 
                                status={review.isApproved ? "Approved" : "Pending"} 
                                text={review.isApproved ? "Approved & Public" : "Pending Moderation"}
                                statusToVariant={{ "Approved": "green", "Pending": "amber" }}
                                className="scale-110 origin-left"
                            />
                            <span className="text-sm font-medium text-slate-500 hidden md:block">
                                Created on {format(new Date(review.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            {review.isApproved ? (
                                <Button 
                                    variant="outline" 
                                    className="rounded-full gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 shadow-sm"
                                    onClick={handleReject}
                                    disabled={isUpdating}
                                >
                                    <ShieldAlert className="h-4 w-4" /> Revoke Approval
                                </Button>
                            ) : (
                                <Button 
                                    variant="outline" 
                                    className="rounded-full gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 shadow-sm"
                                    onClick={handleApprove}
                                    disabled={isUpdating}
                                >
                                    <ShieldCheck className="h-4 w-4" /> Approve for Store
                                </Button>
                            )}
                            
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 bg-white border border-slate-200 shadow-sm shrink-0"
                                onClick={() => setIsDeleting(true)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* CUSTOMER CRITIQUE */}
                    <Card className="md:col-span-2 rounded-[1.5rem] border-slate-200/60 shadow-sm">
                        <CardContent className="p-8 space-y-6">
                            <div className="flex items-start justify-between border-b border-slate-100 pb-6">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 border-b pb-2 inline-block">Review Content</h3>
                                    <p className="mt-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Customer</p>
                                    <p className="text-lg font-bold text-slate-900">{review.reviewerName}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-0.5 mb-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star 
                                                key={star}
                                                className={`h-5 w-5 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-slate-600 border border-slate-200 rounded-md px-2 py-0.5 bg-slate-50">{review.rating} out of 5</span>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative">
                                <span className="absolute top-4 left-4 text-4xl text-slate-200 leading-none">"</span>
                                <p className="relative z-10 text-base text-slate-700 italic leading-relaxed pt-2">
                                    {review.comment}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* PRODUCT CONTEXT */}
                    <Card className="rounded-[1.5rem] border-slate-200/60 shadow-sm h-fit">
                        <CardContent className="p-6 space-y-5">
                            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Product Context</h3>
                            <div className="space-y-4 pt-2">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Reference ID</span>
                                    <span className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">{review.product.id}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Product Title</span>
                                    <span className="text-sm font-semibold text-slate-900">{review.product.title}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">URL Slug</span>
                                    <span className="text-sm text-slate-500 break-all">{review.product.slug}</span>
                                </div>

                                <Link href={`/catalog/products/${review.product.id}`}>
                                    <Button variant="outline" className="w-full mt-4 rounded-xl gap-2 shadow-sm font-medium">
                                        <ExternalLink className="h-4 w-4" /> View Product
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <CommonAlertDialog
                open={isDeleting}
                onOpenChange={setIsDeleting}
                title="Delete System Record"
                subtitle={`Are you sure you want to permanently delete review ${review.id}? This action cannot be reversed.`}
                variant="error"
                ImageComponent={Image}
                buttons={[
                    { label: "Cancel", onClick: () => setIsDeleting(false), variant: "outline" },
                    { label: "Erase Completely", onClick: handleDelete, variant: "destructive" },
                ]}
            />
        </DashboardLayout>
    );
}
