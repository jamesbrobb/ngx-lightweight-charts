import {LogicalRange, MouseEventParams, Point, Range} from "lightweight-charts";
import {BehaviorSubject, filter, map, merge, Observable, share, Subject, Subscription, takeUntil, tap} from "rxjs";


export type Syncable = {
  setVisibleLogicalRange(range: Range<number>): void
  readonly visibleLogicalRangeChange$: Observable<LogicalRange | null>
}

export type SyncableWithCrosshair<HorzScaleItem> = Syncable & {
  setCrossHairPositionByPoint(point: Point, time?: HorzScaleItem): void
  clearCrosshairPosition(): void
  readonly crossHairMove$: Observable<MouseEventParams<HorzScaleItem>>
}

export function isSyncableWithCrosshair<HorzScaleItem>(arg: Syncable): arg is SyncableWithCrosshair<HorzScaleItem> {
  return 'setCrosshairPosition' in arg &&
    'clearCrosshairPosition' in arg &&
    'crossHairMove$' in arg;
}

export function isOutputWithData<T>(update: MultiStreamOutput<T> | undefined): update is MultiStreamOutput<NonNullable<T>> {
  return !!update && !!update.data;
}


export class SyncService<HorzScaleItem> {

  #syncables?: Syncable[];

  readonly #destroy = new Subject<void>();
  readonly #destroyed$ = this.#destroy.asObservable();

  readonly #visibleLogicalRange = new MultiStream<LogicalRange | null>();
  readonly visibleLogicalRange$ = this.#visibleLogicalRange.stream$.pipe(
    filter(isOutputWithData<LogicalRange | null>),
    tap(arg => {
      this.#syncables
        ?.filter(
          syncable => syncable.visibleLogicalRangeChange$ !== arg?.source
        )
        .forEach(syncable => {
          syncable.setVisibleLogicalRange(arg.data);
        });
    }),
    map(arg => arg.data),
    share()
  );

  readonly #crosshairPosition = new MultiStream<MouseEventParams<HorzScaleItem>>();
  readonly crosshairPosition$ = this.#crosshairPosition.stream$.pipe(
    filter(isMultiStreamOutput),
    tap(arg => {
      this.#syncables
        ?.filter(isSyncableWithCrosshair<HorzScaleItem>)
        .filter(syncable => syncable.crossHairMove$ !== arg?.source)
        .forEach(syncable => {
          const data = arg.data;

          if (!data.point || !data.time) {
            syncable.clearCrosshairPosition();
            return;
          }

          if(!data.sourceEvent) {
            return;
          }

          syncable.setCrossHairPositionByPoint(data.point, data.time);
        });
    }),
    map(arg => arg?.data),
    share()
  );

  constructor() {
    this.visibleLogicalRange$.pipe(
      takeUntil(this.#destroyed$),
    ).subscribe();

    this.crosshairPosition$.pipe(
      takeUntil(this.#destroyed$),
    ).subscribe();
  }

  register(arg: Syncable[], clearExisting: boolean = true): void {

    if(clearExisting || !this.#syncables) {
      this.#syncables = [];
    }

    arg = arg.filter(arg => !this.#syncables!.includes(arg));

    this.#syncables = this.#syncables.concat(arg);

    this.#updateStreams();
  }

  deregister(arg: Syncable): void {

    if(!this.#syncables) {
      return;
    }

    const index = this.#syncables.indexOf(arg);

    if(index === -1) {
      return;
    }

    this.#syncables.splice(index, 1);
    this.#updateStreams();
  }

  #updateStreams(): void {

    if(!this.#syncables) {
      return;
    }

    this.#visibleLogicalRange.updateObservables(
      this.#syncables.map(syncable => syncable.visibleLogicalRangeChange$)
    );

    const currentLogicalRange = this.#visibleLogicalRange.currentValue;

    if(currentLogicalRange) {
      this.#syncables.forEach(syncable => {
        syncable.setVisibleLogicalRange(currentLogicalRange);
      });
    }

    this.#crosshairPosition.updateObservables(
      this.#syncables.filter(isSyncableWithCrosshair<HorzScaleItem>)
        .map(syncable => syncable.crossHairMove$)
    );
  }

  destroy(): void {
    this.#visibleLogicalRange.destroy();
    this.#crosshairPosition.destroy();
    this.#destroy.next();
    this.#destroy.complete();
  }
}


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

    this.#subscription = merge(...streams.map(arg => arg.pipe(
      map(data => ({source: arg, data}))
    ))).subscribe(this.#subject);
  }

  destroy(): void {
    this.#cleanUp();
  }

  #cleanUp(): void {
    this.#subscription?.unsubscribe();
    this.#subscription = undefined;
  }
}


function isMultiStreamOutput<T>(arg: MultiStreamOutput<T> | undefined): arg is MultiStreamOutput<T> {
  return !!arg && !!arg.data;
}
