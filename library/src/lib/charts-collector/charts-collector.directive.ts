import {bufferCount, filter, from, map, mergeMap, switchMap} from "rxjs";
import {contentChildren, Directive} from '@angular/core';
import {takeUntilDestroyed, toObservable, toSignal} from "@angular/core/rxjs-interop";
import {TVChart} from "../charts";


@Directive({
  selector: '[tvChartsCollector]',
  standalone: true
})
export class TVChartsCollectorDirective {

  readonly childCharts = contentChildren<TVChart<any>>(TVChart);

  readonly charts = toSignal(
    toObservable(this.childCharts).pipe(
      takeUntilDestroyed(),
      switchMap(charts => {
        return from(charts).pipe(
          mergeMap(chart => {
            return chart.initialised$.pipe(
              filter(initialised => !!initialised),
              map(() => chart)
            )
          }),
          bufferCount(charts.length),
          map((arg) => charts)
        )
      })
    )
  );
}
