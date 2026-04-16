"use client";

import { BellDot } from "lucide-react";

import { getUnreadCount, type Notification } from "./notifications-data";
import { NotificationsPopup } from "./notifications-popup";
import { Badge } from "@corpora/ui";
import { Button } from "@corpora/ui";
import { Popover, PopoverTrigger } from "@corpora/ui";

interface NotificationBellProps {
  /** Array of notifications to display */
  notifications: Notification[];
  /** Callback when "Mark as Read" is clicked */
  onMarkAllAsRead?: () => void;
  /** Callback when "View More" is clicked */
  onViewMore?: () => void;
}

export function NotificationBell({
  notifications,
  onMarkAllAsRead,
  onViewMore
}: NotificationBellProps) {
  const unreadCount = getUnreadCount(notifications);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full border-0 bg-white text-slate-500 shadow-sm size-8 md:size-10"
        >
          <BellDot className="size-4 md:size-5 text-slate-500" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-0.5 -top-0.5 md:-right-1 md:-top-1 flex size-4 md:size-5 items-center justify-center rounded-full p-0 text-[9px] md:text-[10px]"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <NotificationsPopup
        notifications={notifications}
        onMarkAllAsRead={onMarkAllAsRead}
        onViewMore={onViewMore}
      />
    </Popover>
  );
}
