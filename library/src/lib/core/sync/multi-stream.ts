import {BehaviorSubject, map, merge, Observable, Subscription} from "rxjs";


export type MultiStreamOutput<T> = {
  source: Observable<T>,
  data: T
}


export class MultiStream<T> {

  readonly #subject = new BehaviorSubject<MultiStreamOutput<T> | undefined>(undefined);
  readonly stream$ = this.#subject.asObservable();

  #subscription?: Subscription;

  get currentValue(): T | undefined {
    return this.#subject.value?.data;
  }

  updateObservables(streams: Observable<T>[]): void {

    this.#cleanUp();

    if(!streams.length) {
      this.#subject.next(undefined);
      return;
    }

    this.#subscription = merge(...streams.map(arg => arg.pipe(
      map(data => ({source: arg, data}))
    ))).subscribe(this.#subject);
  }

  destroy(): void {
    this.#cleanUp();
    this.#subject.complete();
  }

  #cleanUp(): void {
    this.#subscription?.unsubscribe();
    this.#subscription = undefined;
  }
}


export function isMultiStreamOutput<T>(arg: MultiStreamOutput<T> | undefined): arg is MultiStreamOutput<T> {
  return !!arg && !!arg.data;
}


export function isOutputWithData<T>(update: MultiStreamOutput<T> | undefined): update is MultiStreamOutput<NonNullable<T>> {
  return !!update && !!update.data;
}
