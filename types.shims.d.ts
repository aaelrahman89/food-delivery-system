import { Query } from '@survv/commons/core/models/Query';

declare module 'vue/types/vue' {
  interface Vue {
    $parseJSONQuery(arg?: unknown): Query;
    $currentLocale: string;
    $rtl: boolean;
    $availableLocales: Array<{
      code: string;
      value: string;
    }>;
    $changeLocale(locale: string): void;
    $intercom: {
      boot(configs: Record<string, unknown>): void;
      shutdown(): void;
      update(): void;
    };
  }
}
