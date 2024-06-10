import {Observable} from "rxjs";
import {DataChangedScope} from "lightweight-charts";


export type SeriesSubscriptions = {
  dataChange$: Observable<DataChangedScope>,
}
