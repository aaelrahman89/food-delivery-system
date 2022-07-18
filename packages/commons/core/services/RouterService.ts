export interface RouterService {
  replace(location: RouteLocation): Promise<void>;
  redirect(location: RouteLocation): Promise<void>;
}

export interface RouteLocation {
  name?: string;
  hash?: string;
  query?: { [key: string]: string | string[] };
  params?: { [key: string]: string };
  path?: string;
}
