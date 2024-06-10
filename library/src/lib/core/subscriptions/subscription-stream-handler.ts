import {BehaviorSubject, fromEventPattern, share, Subject, switchMap, takeUntil} from "rxjs";


export type HandlerCallbackFn<T> = (arg: T) => void;
export type SubHandlerFn<T> = (handler: HandlerCallbackFn<T>) => void


export class SubscriptionStreamHandler<Param> {

  readonly #subscribeFn: SubHandlerFn<Param>;
  readonly #unsubscribeFn: SubHandlerFn<Param>;

  readonly #subject = new BehaviorSubject<Param | undefined>(undefined);

  readonly #destroy = new Subject();
  readonly #destroy$ = this.#destroy.asObservable();

  readonly #subscribeHandler = (handler: HandlerCallbackFn<Param>): void => {
    this.#subscribeFn(handler);
  }

  readonly #unsubscribeHandler = (handler: HandlerCallbackFn<Param>): void => {
    this.#unsubscribeFn(handler);
  }

  readonly stream$ = this.#subject.asObservable().pipe(
    switchMap(() => fromEventPattern<Param>(
      this.#subscribeHandler,
      this.#unsubscribeHandler
    )),
    takeUntil(this.#destroy$),
    share()
  );

  constructor(
    subscribeFn: SubHandlerFn<Param>,
    unsubscribeFn: SubHandlerFn<Param>
  ) {
    this.#subscribeFn = subscribeFn;
    this.#unsubscribeFn = unsubscribeFn;
  }

  destroy(): void {
    this.#destroy.next(true);
    this.#destroy.complete();
    this.#subject.complete();
  }
}
