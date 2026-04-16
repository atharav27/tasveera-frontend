import { Separator } from "@corpora/ui";

interface NotificationSectionProps {
  category: string;
  showSeparator?: boolean;
}

export function NotificationSection({ category, showSeparator = true }: NotificationSectionProps) {
  return (
    <>
      <div className="px-3 md:px-4 pt-4 md:pt-5 pb-1.5 md:pb-2">
        <h3 className="text-xs md:text-sm font-medium text-slate-400 tracking-wide">{category}</h3>
      </div>
      {showSeparator && <Separator />}
    </>
  );
}

