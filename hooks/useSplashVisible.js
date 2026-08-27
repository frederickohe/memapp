import { createContext, useContext } from "react";

export const SplashVisibleContext = createContext(false);

export function useSplashVisible() {
  return useContext(SplashVisibleContext);
}
