import {Observable} from "rxjs";
import {LogicalRange, Range, Time} from "lightweight-charts";


export type TimescaleSubscriptions = {
  visibleTimeRangeChange$: Observable<Range<Time> | null>
  visibleLogicalRangeChange$: Observable<LogicalRange | null>
  sizeChange$: Observable<number>
}
