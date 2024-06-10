import {Observable} from "rxjs";
import {MouseEventParams, Time} from "lightweight-charts";


export type ChartSubscriptions = {
  crossHairMove$: Observable<MouseEventParams<Time>>;
  click$: Observable<MouseEventParams<Time>>;
  dblClick$: Observable<MouseEventParams<Time>>;
}
