import {map, merge, Observable, Subject, Subscription} from "rxjs";


export type MultiStreamOutput<T> = {
  source: Observable<T>,
  data: T
}


export class MultiStream<T> {

  readonly #subject = new Subject<MultiStreamOutput<T> | undefined>();
  readonly stream$ = this.#subject.asObservable();

  #subscription?: Subscription;

  setObservables(streams: Observable<T>[]): void {

    this.#cleanUp();

    this.#subscription = merge(...streams.map(arg => arg.pipe(
      map(data => {
        return ({source: arg, data})
      })
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
