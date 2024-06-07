import {BehaviorSubject, fromEventPattern, share, Subject, switchMap, takeUntil} from "rxjs";


export type HandlerFn<T> = (arg: T) => void;

export interface SubscriptionHandler<T> {
  subscribe(handler: HandlerFn<T>): void;
  unsubscribe(handler: HandlerFn<T>): void;
}


export class SubscriptionStreamHandler<T> {

  readonly #handler: SubscriptionHandler<T>;
  readonly #destroy = new Subject();
  readonly #destroy$ = this.#destroy.asObservable();

  readonly #subscribeHandler = (handler: HandlerFn<T>) => {
    this.#handler.subscribe(handler);
  }

  readonly #unsubscribeHandler = (handler: HandlerFn<T>) => {
    this.#handler.unsubscribe(handler);
  }

  readonly #eventHandler$ = fromEventPattern<T>(
    this.#subscribeHandler,
    this.#unsubscribeHandler
  )

  readonly #subject = new BehaviorSubject<T | undefined>(undefined);
  readonly stream$ = this.#subject.asObservable().pipe(
    switchMap(() => this.#eventHandler$),
    takeUntil(this.#destroy$),
    share()
  );

  constructor(handler: SubscriptionHandler<T>) {
    this.#handler = handler;
  }

  destroy(): void {
    this.#destroy.next(true);
    this.#destroy.complete();
    this.#subject.complete();
  }
}
