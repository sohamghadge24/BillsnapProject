export type PublicView = 'home' | 'about' | 'contact' | 'pricing' | 'login' | 'register' | 'profileQuestions' ;
export type AppView = 'dashboard' | 'expenses' | 'scanner' | 'reports' | 'Budget' | 'profile';

export interface NavigationState {
  isAuthenticated: boolean;
  currentPublicView?: PublicView;
  currentAppView?: AppView;
}