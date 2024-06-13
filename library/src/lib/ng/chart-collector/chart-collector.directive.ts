import {bufferCount, from, map, mergeMap, share, switchMap} from "rxjs";
import {contentChildren, Directive, inject} from '@angular/core';
import {takeUntilDestroyed, toObservable, toSignal} from "@angular/core/rxjs-interop";
import {SeriesType} from "lightweight-charts";
import {TVChart} from "../../core";


@Directive({
  selector: '[tvChartCollector]',
  standalone: true
})
export class TVChartCollectorDirective<T extends SeriesType, HorzScaleItem> {

  readonly #chart = inject(TVChart<T, HorzScaleItem>, {optional: true});

  readonly childCharts = contentChildren<TVChart<T, HorzScaleItem>>(TVChart);

  readonly charts = toSignal(
    toObservable(this.childCharts).pipe(
      takeUntilDestroyed(),
      map(charts => [...(this.#chart ? [this.#chart] : []), ...charts]),
      switchMap(charts => from(charts).pipe(
        mergeMap(chart => chart.initialised$),
        bufferCount(charts.length),
        map(() => charts)
      )),
      share()
    )
  );
}
