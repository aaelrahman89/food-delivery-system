import { BaseMessage } from './BaseMessage';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { BehaviorSubject, Observable } from 'rxjs';

export abstract class BaseBloc<ACTION, MESSAGE extends BaseMessage> {
  protected abstract _message: MESSAGE;

  protected abstract readonly outbox$: BehaviorSubject<MESSAGE>;
  protected abstract readonly inbox$: BehaviorSubject<ACTION>;

  protected abstract handleActions(action: ACTION): void;

  inbox(): BehaviorSubject<ACTION> {
    return this.inbox$;
  }

  outbox(): Observable<MESSAGE> {
    return this.outbox$.asObservable();
  }

  dispose(): void {
    this.inbox$.complete();
    this.outbox$.complete();
  }
}
