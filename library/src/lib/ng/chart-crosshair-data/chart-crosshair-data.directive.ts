import {Directive, effect, inject, input, OnDestroy} from '@angular/core';
import {CrosshairService, filterChartsByIds} from "../../core";
import {TVChartCollectorDirective} from "../chart-collector/chart-collector.directive";
import {outputFromObservable} from "@angular/core/rxjs-interop";


@Directive({
  selector: '[tvChartCrosshairData]',
  standalone: true,
  providers: [{
    provide: CrosshairService,
    useFactory: () => {
      return new CrosshairService();
    }
  }]
})
export class TVChartCrosshairDataDirective implements OnDestroy {

  readonly #collector = inject(TVChartCollectorDirective);
  readonly #crosshairService = inject(CrosshairService);

  ids = input<string | string[]>('', {alias: 'tvChartCrosshairDataIds'});

  data = outputFromObservable(this.#crosshairService.crosshairPosition$, {alias: 'tvChartCrosshairData'});

  constructor() {
    effect(() => {
      this.#crosshairService.register(
        (this.#collector.charts() || []).filter(filterChartsByIds(this.ids()))
      );
    });
  }

  ngOnDestroy() {
    this.#crosshairService.destroy();
  }
}
