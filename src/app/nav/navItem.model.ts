export interface NavItem {
  name: string;
  actionFunctionName?: any;
  authenticationStatusMatters: boolean;
  routerLink?: string;
  requiredUserAuthenticationStatus?: boolean;
}
