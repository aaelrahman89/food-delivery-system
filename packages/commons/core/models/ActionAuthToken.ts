export interface ActionAuthTokenProps extends Record<string, unknown> {
  iss: string;
  sub: string;
  roles: string[];
  exp: number;
}

export class ActionAuthToken {
  iss = '';
  sub = '0';
  roles: string[] = [];
  exp = 0;
  constructor(args?: ActionAuthTokenProps) {
    Object.assign(this, args);
  }

  isExpired(): boolean {
    return this.exp <= Math.floor(Date.now() / 1000);
  }

  isNotExpired(): boolean {
    return this.exp > Math.ceil(Date.now() / 1000);
  }
}
