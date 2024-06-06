import {share, Subject, tap} from "rxjs";


export interface Handler<T> {
  subscribe(handler: (arg: T) => void): void;
  unsubscribe(handler: (arg: T) => void): void;
}


export class SubscriptionHandler<T> {

  readonly #subject = new Subject<T>();
  readonly stream$ = this.#subject.asObservable().pipe(
    tap({
      subscribe: () => this.#subscribeHandler(),
      unsubscribe: () => this.#unsubscribeHandler(),
      finalize: () => this.#unsubscribeHandler()
    }),
    share()
  );

  readonly #handler: Handler<T>;

  constructor(handler: Handler<T>) {
    this.#handler = handler;
  }

  destroy(): void {
    this.#subject.complete();
  }

  #subscribeHandler(): void {
    this.#handler.subscribe(this.#handlerHandler);
  }

  #unsubscribeHandler(): void {
    this.#handler.unsubscribe(this.#handlerHandler);
  }

  readonly #handlerHandler = (value: T): void => {
    this.#subject.next(value);
  }
}
