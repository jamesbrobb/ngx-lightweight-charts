import {Observable} from "rxjs";
import {LogicalRange, Range, Time} from "lightweight-charts";


export type TimescaleSubscriptions<HorzScaleItem = Time> = {
  visibleTimeRangeChange$: Observable<Range<HorzScaleItem> | null>
  visibleLogicalRangeChange$: Observable<LogicalRange | null>
  sizeChange$: Observable<number>
  destroy(): void
}
