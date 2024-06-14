import {Directive, effect, inject, input} from '@angular/core';
import {filterChartsByIds, SyncService} from "../../core";
import {TVChartCollectorDirective} from "../chart-collector/chart-collector.directive";
import {outputFromObservable} from "@angular/core/rxjs-interop";


@Directive({
  selector: '[tvChartSync]',
  standalone: true,
  providers: [{
    provide: SyncService,
    useFactory: () => {
      return new SyncService();
    }
  }]
})
export class TVChartSyncDirective {

  readonly #collector = inject(TVChartCollectorDirective);
  readonly #syncService = inject(SyncService);

  ids = input<string | string[]>('', {alias: 'tvChartSync'});

  visibleLogicalRange = outputFromObservable(this.#syncService.visibleLogicalRange$);
  crosshairPosition = outputFromObservable(this.#syncService.crosshairPosition$);

  constructor() {
    effect(() => {
      this.#syncService.register(
        (this.#collector.charts() || []).filter(filterChartsByIds(this.ids()))
      );
    });
  }

  ngOnDestroy() {
    this.#syncService.destroy();
  }
}
