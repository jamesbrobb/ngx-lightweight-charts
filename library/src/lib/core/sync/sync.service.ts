import {ISeriesApi, LogicalRange, Range, SeriesType, Time} from "lightweight-charts";
import {Observable} from "rxjs";


export interface Syncable<HorzScaleItem = Time> {
  setVisibleLogicalRange(range: Range<number>): void
  //setVisibleRange(range: Range<HorzScaleItem>): void
  //setCrosshairPosition(price: number, horizontalPosition: HorzScaleItem, seriesApi: ISeriesApi<SeriesType, HorzScaleItem>): void
  //clearCrosshairPosition(): void
  visibleLogicalRangeChange$: Observable<LogicalRange | null>
}


export class SyncService {

  readonly #syncables: Syncable[] = [];

  register(arg: Syncable): void {
    if(this.#syncables.includes(arg)) {
      return;
    }
    this.#syncables.push(arg);
  }

  deregister(arg: Syncable): void {
    const index = this.#syncables.indexOf(arg);
    if(index === -1) {
      return;
    }
    this.#syncables.splice(index, 1);
  }
}
