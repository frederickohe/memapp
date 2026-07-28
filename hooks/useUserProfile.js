import { useMemo } from "react";
import { mapAuthToProfile } from "@/lib/userProfile";
import { useAuthStore } from "@/stores/useAuthStore";

export function useUserProfile() {
  const user = useAuthStore((state) => state.user);
  const phone = useAuthStore((state) => state.phone);
  const email = useAuthStore((state) => state.email);

  return useMemo(
    () => mapAuthToProfile({ user, phone, email }),
    [user, phone, email]
  );
}
