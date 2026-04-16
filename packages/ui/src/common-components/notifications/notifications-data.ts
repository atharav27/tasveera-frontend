export interface Notification {
  id: string;
  type: "activity" | "sos" | "ticket" | "finance" | "system";
  category: string;
  title: string;
  subtitle: string;
  timestamp: Date | string;
  isRead: boolean;
  icon: string;
}

export function getUnreadCount(notifications: Notification[]): number {
  return notifications.filter((notification) => !notification.isRead).length;
}

export function groupNotificationsByCategory(notifications: Notification[]): Record<string, Notification[]> {
  return notifications.reduce(
    (acc, notification) => {
      const category = notification.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(notification);
      return acc;
    },
    {} as Record<string, Notification[]>,
  );
}
