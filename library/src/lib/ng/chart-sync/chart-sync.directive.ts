import {Directive, effect, inject} from '@angular/core';
import {SyncService} from "../../core";
import {TVChartCollectorDirective} from "../chart-collector/chart-collector.directive";


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

  constructor() {
    effect(() => {
      const charts = this.#collector.charts();

      if (!charts) {
        return;
      }

      /*
        need to manage register/deregister at this level
       */
      charts.forEach(chart => {
        this.#syncService.register(chart);
      });
    });
  }

}
