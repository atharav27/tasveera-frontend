"use client";

import { useState, type ReactNode } from "react";

import { ChevronDown } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../components/collapsible";
import { cn } from "../../lib/utils";

interface SettingsCategorySectionProps {
    title: string;
    description: string;
    defaultExpanded?: boolean;
    children: ReactNode;
}

export function SettingsCategorySection({
    title,
    description,
    defaultExpanded = false,
    children,
}: SettingsCategorySectionProps) {
    const [isOpen, setIsOpen] = useState(defaultExpanded);

    return (
        <div className="rounded-lg bg-white p-4 md:p-6 shadow-sm">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger className="flex w-full items-center justify-between py-1 px-1 md:px-2 text-left transition-colors hover:bg-transparent">
                    <div className="flex flex-col items-start gap-0.5 md:gap-1 min-w-0 flex-1">
                        <h2 className="text-lg md:text-xl font-medium text-primary">{title}</h2>
                        <p className="text-xs md:text-sm text-slate-600">{description}</p>
                    </div>
                    <ChevronDown
                        className={cn("size-6 md:size-7 p-1 text-slate-500 transition-transform duration-200 border border-brand-blue-base rounded-full shrink-0 cursor-pointer", isOpen && "rotate-180")}
                    />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-4 pt-8 md:pb-5 md:pt-12">{children}</CollapsibleContent>
            </Collapsible>
        </div>
    );
}
