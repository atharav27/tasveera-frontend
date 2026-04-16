import {
  AlertCircle,
  Book,
  Calendar,
  DollarSign,
  FileText,
  Route,
  Ticket,
  Truck,
  Users,
} from "lucide-react";

import { cn, formatTimeAgo } from "./utils";
import type { Notification } from "./notifications-data";

interface NotificationItemProps {
  notification: Notification;
}

function renderIcon(iconName: string, className: string) {
  switch (iconName) {
    case "Calendar":
      return <Calendar className={className} />;
    case "Truck":
      return <Truck className={className} />;
    case "AlertCircle":
      return <AlertCircle className={className} />;
    case "Route":
      return <Route className={className} />;
    case "Ticket":
      return <Ticket className={className} />;
    case "FileText":
      return <FileText className={className} />;
    case "DollarSign":
      return <DollarSign className={className} />;
    case "Book":
      return <Book className={className} />;
    case "Users":
      return <Users className={className} />;
    default:
      return <Calendar className={className} />;
  }
}

function getIconBackgroundColor(type: Notification["type"]): string {
  switch (type) {
    case "sos":
      return "bg-red-100";
    case "activity":
      return "bg-brand-blue-base";
    case "ticket":
      return "bg-brand-blue-base";
    case "finance":
      return "bg-brand-blue-base";
    case "system":
      return "bg-brand-blue-base";
    default:
      return "bg-brand-blue-base";
  }
}

function getIconColor(type: Notification["type"]): string {
  switch (type) {
    case "sos":
      return "text-red-600";
    default:
      return "text-slate-600";
  }
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const iconBgColor = getIconBackgroundColor(notification.type);
  const iconColor = getIconColor(notification.type);

  return (
    <div className="flex items-start gap-2 md:gap-3 py-2 md:py-3">
      <div className={cn("flex size-8 md:size-10 items-center justify-center rounded-full", iconBgColor)}>
        {renderIcon(notification.icon, cn("size-4 md:size-5", iconColor))}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs md:text-sm font-medium text-primary">{notification.title}</p>
        <p className="text-[11px] md:text-xs text-slate-600 mt-0.5">{notification.subtitle}</p>
        <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 md:mt-1">{formatTimeAgo(notification.timestamp)}</p>
      </div>

      {!notification.isRead && (
        <div className="mt-1.5 md:mt-2 size-1.5 md:size-2 rounded-full bg-blue-500 shrink-0" />
      )}
    </div>
  );
}

