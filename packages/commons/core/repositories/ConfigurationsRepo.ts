export interface ConfigurationsRepo {
  getConfigItem(items: string[]): Promise<Record<string, string>>;
}
