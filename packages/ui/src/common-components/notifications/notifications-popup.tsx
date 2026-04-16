"use client";

import { CheckCheck } from "lucide-react";

import { BadgeVariant } from "@corpora/ui";
import { Button } from "@corpora/ui";
import { PopoverContent } from "@corpora/ui";
import { Separator } from "@corpora/ui";
import { getUnreadCount, groupNotificationsByCategory, type Notification } from "./notifications-data";

import { NotificationItem } from "./notification-item";
import { NotificationSection } from "./notification-section";

interface NotificationsPopupProps {
  /** Array of notifications to display */
  notifications: Notification[];
  /** Callback when "Mark as Read" is clicked */
  onMarkAllAsRead?: () => void;
  /** Callback when "View More" is clicked */
  onViewMore?: () => void;
}

export function NotificationsPopup({
  notifications,
  onMarkAllAsRead,
  onViewMore
}: NotificationsPopupProps) {
  const unreadCount = getUnreadCount(notifications);
  const groupedNotifications = groupNotificationsByCategory(notifications);

  const categoryOrder = ["Activities", "SOS Alerts", "Ticket Updates", "Finance Updates", "System & Policy"];

  return (
    <PopoverContent align="end" side="bottom" className="w-[calc(100vw-2rem)] sm:w-[420px] p-0 mt-2 sm:mt-3 rounded-xl shadow-xl">
      <div className="flex flex-col max-h-[70vh] sm:max-h-[60vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-3 md:px-4 pb-2 pt-4 md:pt-5 shrink-0">
          <div className="flex items-center gap-1.5 md:gap-2">
            <h2 className="text-xs md:text-sm font-medium font-primary text-primary">Notifications</h2>
            {unreadCount > 0 && (
              <BadgeVariant variant="primary" size="sm" rounded="default" className="py-0.5 md:py-1 text-[10px] md:text-xs">
                {unreadCount} new
              </BadgeVariant>
            )}
          </div>
          {unreadCount > 0 && onMarkAllAsRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="h-auto p-0 text-[10px] md:text-xs font-medium text-slate-400 cursor-pointer hover:bg-transparent"
            >
              <CheckCheck className="size-3 md:size-4" />
              Mark as Read
            </Button>
          )}
        </div>

        {/* Scrollable Content */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {notifications.length === 0 ? (
            <div className="flex items-center justify-center py-12 px-4">
              <p className="text-sm text-slate-400">No notifications</p>
            </div>
          ) : (
            categoryOrder.map((category, index) => {
              const categoryNotifications = groupedNotifications[category];
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              if (!categoryNotifications || categoryNotifications.length === 0) {
                return null;
              }

              return (
                <div key={category}>
                  {index > 0 && <Separator />}
                  <NotificationSection category={category} showSeparator={false} />
                  <div className="px-3 md:px-4">
                    {categoryNotifications.map((notification) => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with View More */}
        {onViewMore && (
          <div className="shrink-0 border-t px-3 md:px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewMore}
              className="w-full text-xs md:text-sm font-medium text-slate-600 hover:text-primary"
            >
              View More
            </Button>
          </div>
        )}
      </div>
    </PopoverContent>
  );
}
