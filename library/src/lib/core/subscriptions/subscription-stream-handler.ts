import {BehaviorSubject, fromEventPattern, map, Observable, share, Subject, switchMap, takeUntil, tap} from "rxjs";


export type HandlerCallbackFn<T> = (arg: T) => void;
export type SubHandlerFn<T> = (handler: HandlerCallbackFn<T>) => void


export class SubscriptionStreamHandler<Param> {

  readonly #subject = new BehaviorSubject<Param | undefined>(undefined);

  readonly #destroy = new Subject();
  readonly #destroy$ = this.#destroy.asObservable();

  readonly stream$: Observable<Param>;

  constructor(
    subscribeFn: SubHandlerFn<Param>,
    unsubscribeFn: SubHandlerFn<Param>
  ) {
    this.stream$ = this.#subject.asObservable().pipe(
      switchMap(() => fromEventPattern<any[]>(
        subscribeFn,
        unsubscribeFn
      )),
      map<any[], Param>((args: any[]) => args[0]),
      takeUntil(this.#destroy$),
      share()
    );
  }

  destroy(): void {
    this.#destroy.next(true);
    this.#destroy.complete();
    this.#subject.complete();
  }
}
