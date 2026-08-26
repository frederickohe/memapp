export function navigateToAuthenticatedApp(router) {
  router.replace("/loading-profile?next=/(tabs)");
}

export function navigateToSignedOutApp(router) {
  router.replace("/(auth)/log-or-sign");
}
