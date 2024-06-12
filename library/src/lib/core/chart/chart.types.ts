import {Observable} from "rxjs";
import {MouseEventParams, Time} from "lightweight-charts";


export type ChartSubscriptions<HorzScaleItem = Time> = {
  crossHairMove$: Observable<MouseEventParams<HorzScaleItem>>
  click$: Observable<MouseEventParams<HorzScaleItem>>
  dblClick$: Observable<MouseEventParams<HorzScaleItem>>
  destroy(): void
}
