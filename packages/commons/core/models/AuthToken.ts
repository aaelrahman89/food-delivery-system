export interface AuthTokenProps extends Record<string, unknown> {
  iss: string;
  sub: string;
  roles: string[];
  exp: number;
}

export class AuthToken {
  iss = '';
  sub = '0';
  roles: string[] = [];
  exp = 0;
  constructor(args?: AuthTokenProps) {
    Object.assign(this, args);
  }

  isExpired(): boolean {
    return this.exp <= Math.floor(Date.now() / 1000);
  }

  isNotExpired(): boolean {
    return this.exp > Math.ceil(Date.now() / 1000);
  }
}
