export interface ServiceWorkerManager {
  isSupported: boolean;
  hasUpdate: boolean;
  init(scriptUrl: string, options?: RegistrationOptions): Promise<void>;
  applyUpdate(): Promise<void>;
  dismissUpdate(): Promise<void>;
}

type SkipWaitingMessage = {
  type: 'SKIP_WAITING';
};
type ClientsClaimMessage = {
  type: 'CLIENT_CLAIM';
};
export type ClientToSwMessage = SkipWaitingMessage | ClientsClaimMessage;

type AcknowledgeMessage = {
  type: 'SW_ACKNOWLEDGE';
};
export type SwToClientMessage = AcknowledgeMessage;
