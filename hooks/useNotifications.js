import { useCallback, useEffect, useState } from "react";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api/notifications";
import {
  filterToApiStatus,
  groupNotifications,
  mapNotification,
} from "@/lib/notificationUtils";
import { useAuthStore } from "@/stores/useAuthStore";

export function useNotifications(activeFilter = "All") {
  const token = useAuthStore((state) => state.token);
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadNotifications = useCallback(
    async ({ refreshing = false } = {}) => {
      if (!token) {
        setNotifications([]);
        setTotal(0);
        setIsLoading(false);
        return;
      }

      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const params = {
          page: 1,
          size: 50,
          status: filterToApiStatus(activeFilter),
        };
        const response = await getNotifications(token, params);

        console.log("[notifications] load response", {
          params,
          response,
        });

        const items = (response?.items || []).map(mapNotification);
        setNotifications(items);
        setTotal(response?.total ?? items.length);
      } catch (err) {
        console.log("[notifications] load error", err);
        setError(err.message || "Unable to load notifications");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [activeFilter, token]
  );

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAsRead = useCallback(
    async (notificationId) => {
      if (!token) return;

      try {
        await markNotificationRead(token, notificationId);
        setNotifications((current) =>
          current.map((item) =>
            item.id === notificationId
              ? { ...item, unread: false, status: "READ" }
              : item
          )
        );
      } catch {
        // Keep UI responsive even if mark-read fails silently.
      }
    },
    [token]
  );

  const markAllAsRead = useCallback(async () => {
    if (!token) return;

    try {
      await markAllNotificationsRead(token);
      setNotifications((current) =>
        current.map((item) => ({ ...item, unread: false, status: "READ" }))
      );
    } catch (err) {
      setError(err.message || "Unable to mark notifications as read");
    }
  }, [token]);

  return {
    sections: groupNotifications(notifications),
    total,
    isLoading,
    isRefreshing,
    error,
    refresh: () => loadNotifications({ refreshing: true }),
    markAsRead,
    markAllAsRead,
  };
}

export function useUnreadNotificationCount() {
  const token = useAuthStore((state) => state.token);
  const [count, setCount] = useState(0);

  const loadCount = useCallback(async () => {
    if (!token) {
      setCount(0);
      return;
    }

    try {
      const params = { page: 1, size: 1, status: "UNREAD" };
      const response = await getNotifications(token, params);

      console.log("[notifications] unread count response", {
        params,
        response,
      });

      setCount(response?.total ?? 0);
    } catch (err) {
      console.log("[notifications] unread count error", err);
      setCount(0);
    }
  }, [token]);

  useEffect(() => {
    loadCount();
  }, [loadCount]);

  return count;
}
