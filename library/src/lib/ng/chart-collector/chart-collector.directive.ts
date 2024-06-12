import {filter, map, tap} from "rxjs";
import {Directive, inject} from '@angular/core';
import {takeUntilDestroyed, toSignal} from "@angular/core/rxjs-interop";
import {TVChart} from "../../core";


@Directive({
  selector: '[tvChartCollector]',
  standalone: true
})
export class TVChartCollectorDirective {

  readonly #chart = inject(TVChart<any>);

  readonly chart = toSignal(
    this.#chart.initialised$.pipe(
      takeUntilDestroyed(),
      filter(initialised => !!initialised)
    )
  );
}
