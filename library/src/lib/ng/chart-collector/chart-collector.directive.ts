import {bufferCount, from, map, mergeMap, share, switchMap} from "rxjs";
import {computed, contentChildren, Directive, inject, input} from '@angular/core';
import {takeUntilDestroyed, toObservable, toSignal} from "@angular/core/rxjs-interop";
import {SeriesType} from "lightweight-charts";
import {filterByIds, TVChart} from "../../core";


@Directive({
  selector: '[tvChartCollector]',
  standalone: true
})
export class TVChartCollectorDirective<T extends SeriesType, HorzScaleItem> {

  readonly #chart = inject(TVChart<T, HorzScaleItem>, {optional: true});

  ids = input<string | string[]>('', {alias: 'tvChartCollector'});

  readonly childCharts = contentChildren<TVChart<T, HorzScaleItem>>(TVChart, {descendants: true});

  readonly #charts = toSignal(
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

  readonly charts = computed(() => {
    return this.#charts()?.filter(filterByIds(this.ids()));
  });
}
