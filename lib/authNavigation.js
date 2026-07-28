export function resetNavigationStack(router) {
  if (typeof router.canDismiss === "function" && router.canDismiss()) {
    router.dismissAll();
  }
}

export function navigateToAuthenticatedApp(router) {
  resetNavigationStack(router);
  router.replace("/loading-profile?next=/(tabs)");
}

export function navigateToSignedOutApp(router) {
  resetNavigationStack(router);
  router.replace("/(auth)/log-or-sign");
}
