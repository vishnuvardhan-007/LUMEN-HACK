// Route constants for consistent navigation
export const ROUTES = {
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Main app routes
  HOME: '/',
  ADMIN_DASHBOARD: '/admin-dashboard',
  USER_DASHBOARD: '/user-dashboard',
  PROFILE: '/profile',
  
  // Feature routes (ready for expansion)
  USERS: '/users',
  SETTINGS: '/settings',
  REPORTS: '/reports',
  ANALYTICS: '/analytics',
  
  // Error routes
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401',
};

// Route groups for easier management
export const AUTH_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER];
export const PROTECTED_ROUTES = [ROUTES.ADMIN_DASHBOARD, ROUTES.USER_DASHBOARD, ROUTES.PROFILE, ROUTES.USERS, ROUTES.SETTINGS];
export const ADMIN_ROUTES = [ROUTES.ADMIN_DASHBOARD, ROUTES.USERS, ROUTES.SETTINGS, ROUTES.REPORTS, ROUTES.ANALYTICS];
export const USER_ROUTES = [ROUTES.USER_DASHBOARD, ROUTES.PROFILE];
export const PUBLIC_ROUTES = [ROUTES.HOME];

export default ROUTES;