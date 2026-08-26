import { useCallback, useEffect, useState } from "react";
import {
  createSocialPost,
  getSocialFeed,
  getSocialProfile,
  getUserSocialPosts,
  likeSocialItem,
  searchSocialUsers,
} from "@/lib/api/social";
import { useAuthStore } from "@/stores/useAuthStore";

export function useSocialFeed() {
  const token = useAuthStore((state) => state.token);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(
    async ({ refreshing = false } = {}) => {
      if (refreshing) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);
      try {
        const feed = await getSocialFeed({ page: 1, size: 40 }, token);
        setItems(feed?.items || []);
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

  const toggleLike = async (itemId) => {
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
      setItems((current) =>
        current.map((item) =>
          item.id === itemId
            ? { ...item, liked: result.liked, likes: result.likes }
            : item
        )
      );
    } catch {
      load({ refreshing: true });
    }
  };

  return {
    items,
    isLoading,
    isRefreshing,
    error,
    refresh: () => load({ refreshing: true }),
    toggleLike,
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
      setProfile(profileData);
      setPosts(postsData?.items || []);
    } catch (err) {
      setError(err.message || "Unable to load profile");
    } finally {
      setIsLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    load();
  }, [load]);

  return { profile, posts, isLoading, error, refresh: load };
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
