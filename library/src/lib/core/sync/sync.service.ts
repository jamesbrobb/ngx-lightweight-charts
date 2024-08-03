import {LogicalRange, MouseEventParams, Point, Range} from "lightweight-charts";
import {filter, map, Observable, share, Subject, takeUntil, tap} from "rxjs";
import {isMultiStreamOutput, isOutputWithData, MultiStream} from "./multi-stream";


export type Syncable = {
  setVisibleLogicalRange(range: Range<number>): void
  getVisibleLogicalRange(): LogicalRange | null | undefined
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

    const currentLogicalRange = this.#getCurrentVisibleLogicalRange();

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

  #getCurrentVisibleLogicalRange(): LogicalRange | null | undefined {
    let value = this.#visibleLogicalRange.currentValue;

    if(value) {
      return value;
    }

    return this.#syncables?.[0]?.getVisibleLogicalRange();
  }
}



