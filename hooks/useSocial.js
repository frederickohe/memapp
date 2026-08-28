import { useCallback, useEffect, useRef, useState } from "react";
import {
  createSocialPost,
  getSocialFeed,
  getSocialProfile,
  getUserSocialPosts,
  likeSocialItem,
  recordSocialView,
  searchSocialUsers,
} from "@/lib/api/social";
import { useAuthStore } from "@/stores/useAuthStore";

const YMCA_PROFILE = {
  id: "ymca",
  name: "YMCA Ghana",
  handle: "ymcaghana",
  branch: "National",
  occupation: "Ghana National Council",
  skills: [],
  points: 0,
  post_count: 0,
  is_self: false,
};

function applyLike(items, itemId, liked, likes) {
  return items.map((item) =>
    item.id === itemId ? { ...item, liked, likes } : item
  );
}

function applyView(items, itemId, viewed, views) {
  return items.map((item) =>
    item.id === itemId ? { ...item, viewed, views } : item
  );
}

export function useRecordSocialView(itemId) {
  const token = useAuthStore((state) => state.token);
  const recordedRef = useRef(false);

  useEffect(() => {
    recordedRef.current = false;
  }, [itemId]);

  useEffect(() => {
    if (!itemId || !token || recordedRef.current) return;
    recordedRef.current = true;
    recordSocialView(itemId, token).catch(() => {
      recordedRef.current = false;
    });
  }, [itemId, token]);
}

export function useSocialFeed() {
  const token = useAuthStore((state) => state.token);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const viewedIds = useRef(new Set());

  const load = useCallback(
    async ({ refreshing = false } = {}) => {
      if (refreshing) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);
      try {
        const feed = await getSocialFeed({ page: 1, size: 40 }, token);
        const next = feed?.items || [];
        next.forEach((item) => {
          if (item?.viewed && item.id) viewedIds.current.add(item.id);
        });
        setItems(next);
      } catch (err) {
        setError(err.message || "Unable to load Y Social");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [token]
  );

  useEffect(() => {
    load();
  }, [load]);

  const toggleLike = useCallback(
    async (itemId) => {
      setItems((current) =>
        current.map((item) => {
          if (item.id !== itemId) return item;
          const liked = !item.liked;
          return {
            ...item,
            liked,
            likes: Math.max(0, (item.likes || 0) + (liked ? 1 : -1)),
          };
        })
      );
      try {
        const result = await likeSocialItem(itemId, token);
        setItems((current) => applyLike(current, itemId, result.liked, result.likes));
      } catch {
        load({ refreshing: true });
      }
    },
    [token, load]
  );

  const recordView = useCallback(
    async (itemId) => {
      if (!itemId || viewedIds.current.has(itemId)) return;
      viewedIds.current.add(itemId);
      try {
        const result = await recordSocialView(itemId, token);
        setItems((current) => applyView(current, itemId, result.viewed, result.views));
      } catch {
        viewedIds.current.delete(itemId);
      }
    },
    [token]
  );

  return {
    items,
    isLoading,
    isRefreshing,
    error,
    refresh: () => load({ refreshing: true }),
    toggleLike,
    recordView,
  };
}

export function useSocialSearch(query) {
  const token = useAuthStore((state) => state.token);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setIsLoading(true);
      try {
        const data = await searchSocialUsers({ q: query.trim(), page: 1, size: 30 }, token);
        if (!cancelled) setResults(data?.items || []);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    const timer = setTimeout(run, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, token]);

  return { results, isLoading };
}

export function useSocialProfile(userId) {
  const token = useAuthStore((state) => state.token);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const viewedIds = useRef(new Set());

  const load = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [profileData, postsData] = await Promise.all([
        getSocialProfile(userId, token),
        getUserSocialPosts(userId, { page: 1, size: 30 }, token),
      ]);
      const nextPosts = postsData?.items || [];
      nextPosts.forEach((item) => {
        if (item?.viewed && item.id) viewedIds.current.add(item.id);
      });
      setProfile(profileData);
      setPosts(nextPosts);
    } catch (err) {
      if (userId === "ymca") {
        setProfile(YMCA_PROFILE);
        setPosts([]);
      } else {
        setError(err.message || "Unable to load profile");
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleLike = useCallback(
    async (itemId) => {
      setPosts((current) =>
        current.map((item) => {
          if (item.id !== itemId) return item;
          const liked = !item.liked;
          return {
            ...item,
            liked,
            likes: Math.max(0, (item.likes || 0) + (liked ? 1 : -1)),
          };
        })
      );
      try {
        const result = await likeSocialItem(itemId, token);
        setPosts((current) => applyLike(current, itemId, result.liked, result.likes));
      } catch {
        load();
      }
    },
    [token, load]
  );

  const recordView = useCallback(
    async (itemId) => {
      if (!itemId || viewedIds.current.has(itemId)) return;
      viewedIds.current.add(itemId);
      try {
        const result = await recordSocialView(itemId, token);
        setPosts((current) => applyView(current, itemId, result.viewed, result.views));
      } catch {
        viewedIds.current.delete(itemId);
      }
    },
    [token]
  );

  return { profile, posts, isLoading, error, refresh: load, toggleLike, recordView };
}

export function useCreatePost() {
  const token = useAuthStore((state) => state.token);
  const [pending, setPending] = useState(false);

  const submit = async (payload) => {
    setPending(true);
    try {
      return await createSocialPost(payload, token);
    } finally {
      setPending(false);
    }
  };

  return { submit, pending };
}
