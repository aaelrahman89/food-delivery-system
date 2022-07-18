import { BaseBloc } from '../../../../core/base/BaseBloc';
import { BaseMessage } from '../../../../core/base/BaseMessage';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { BehaviorSubject } from 'rxjs';
import { expect } from 'chai';

class FakeAction {
  type = '';

  constructor(type = '') {
    this.type = type;
  }
}

class FakeMessage extends BaseMessage {
  status = '';
  action: FakeAction = new FakeAction();
}

class FakeBlocImplementation extends BaseBloc<FakeAction, FakeMessage> {
  protected _message = new FakeMessage();
  inboxCompleted = false;
  inbox$ = new BehaviorSubject(new FakeAction());
  outbox$ = new BehaviorSubject(new FakeMessage());

  constructor() {
    super();
    this.inbox$.subscribe({
      next: (action: FakeAction) => {
        this.handleActions(action);
      },
      complete: () => {
        this.inboxCompleted = true;
      },
    });
  }

  protected handleActions(action: FakeAction) {
    const newMessage = this._message.clone();
    newMessage.action = action;
    this._message = newMessage;
    this.outbox$.next(this._message);
  }
}

describe('BaseBloc Unit', function () {
  it('bloc extending BaseBloc will have inbox stream', function () {
    const bloc = new FakeBlocImplementation();
    expect(bloc.inbox()).to.deep.equal(bloc.inbox$);
  });

  it('bloc extending BaseBloc will have outbox stream', function () {
    const bloc = new FakeBlocImplementation();

    expect(bloc.outbox()).to.deep.equal(bloc.outbox$.asObservable());
  });

  it('completes the inbox & outbox streams on dispose', function () {
    const bloc = new FakeBlocImplementation();

    let outBoxCompleted = false;

    bloc.outbox().subscribe({
      complete: () => {
        outBoxCompleted = true;
      },
    });
    bloc.dispose();

    expect(bloc.inboxCompleted).to.be.true;
    expect(outBoxCompleted).to.be.true;
  });
});
