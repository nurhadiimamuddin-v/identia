// Firestore collection names — maps 1:1 to MySQL tables
export const COLLECTIONS = {
  ACCOUNT: 'account',
  OCCUPANT: 'occupant',
  CHATS: 'chats',
  FOTO_TOKENS: 'foto_tokens',
  HISTORY: 'history',
  LOGIN_HISTORY: 'login_history',
  MONITORING_COMPONENTS: 'monitoring_components',
  MONITORING_HISTORY: 'monitoring_history',
  NOTIFICATIONS: 'notifications',
  PROFILE: 'profile',
  PUSH_SUBSCRIPTIONS: 'push_subscriptions',
  ROOM: 'room',
  SCHEDULE: 'schedule',
  TFT_DESIGNS: 'tft_designs',
} as const;

// Auto-increment counter collection (simulates MySQL AUTO_INCREMENT)
export const COUNTERS_COLLECTION = '_counters';
