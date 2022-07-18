export interface IntercomRepo {
  getAppId(): Promise<string>;
}
