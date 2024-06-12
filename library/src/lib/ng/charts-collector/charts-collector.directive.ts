import {bufferCount, from, map, mergeMap, share, switchMap} from "rxjs";
import {contentChildren, Directive} from '@angular/core';
import {takeUntilDestroyed, toObservable, toSignal} from "@angular/core/rxjs-interop";
import {TVChart} from "../../core";


@Directive({
  selector: '[tvChartsCollector]',
  standalone: true
})
export class TVChartsCollectorDirective {

  readonly childCharts = contentChildren<TVChart<any>>(TVChart);

  readonly charts = toSignal(
    toObservable(this.childCharts).pipe(
      takeUntilDestroyed(),
      switchMap(charts => from(charts).pipe(
        mergeMap(chart => chart.initialised$),
        bufferCount(charts.length),
        map(() => charts)
      )),
      share()
    )
  );
}
