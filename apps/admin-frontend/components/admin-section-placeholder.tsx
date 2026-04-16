interface AdminSectionPlaceholderProps {
    title: string;
    description?: string;
}

export function AdminSectionPlaceholder({
    title,
    description = "This section is coming soon.",
}: AdminSectionPlaceholderProps) {
    return (
        <div className="rounded-xl border bg-card p-8 text-center">
            <p className="font-semibold text-foreground">{title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
    );
}
